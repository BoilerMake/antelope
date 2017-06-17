<?php

namespace App\Models;

use Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Log;

class Thread extends Model
{
    use SoftDeletes;
    protected $fillable = ['inbox_id', 'state'];
    protected $appends = ['snippet'];

    const STATE_NEW = 'new';
    const STATE_ASSIGNED = 'assigned';
    const STATE_IN_PROGRESS = 'in-progress';
    const STATE_DONE = 'done';

    public static function invalidateCacheById($thread_id)
    {
        Log::info("invalidating caches for thread #{$thread_id}");
        Cache::tags("thread-{$thread_id}")->flush();
    }

    public function inbox()
    {
        return $this->belongsTo('App\Models\Inbox');
    }

    public function messages()
    {
        return $this->hasMany('App\Models\Message');
    }

    public function userEvents()
    {
        return $this->hasMany('App\Models\UserEvent');
    }

    public function users()
    {
        return $this->belongsToMany('App\Models\User');
    }

    public function drafts()
    {
        return $this->hasMany('App\Models\Draft');
    }

    public function getSnippetAttribute()
    {
        //need to invalidate this when the messages in a thread change.
        return Cache::tags(["thread-{$this->id}"])
            ->rememberForever("thread-snippet-{$this->id}", function () {
                return $this->getSnippetAttributeFresh();
            });
    }
    /**
     * Provides a snippet, to be used for the thread list.
     * This is the most recent message in the thread (chronologically).
     *
     * @return mixed
     */
    private function getSnippetAttributeFresh()
    {
        $latestMessage =  $this->messages()->orderBy('created_at', 'desc')->first();
        if($latestMessage)
            return $latestMessage;
        return [
            "created_at" => $this->created_at,
            "subject" => "[new thread]",
            "from" => "",
            "body_plain" => "",
            "empty" => true,
        ];
    }

    /**
     * Gets the threads for given $inbox_ids
     * Sorts them by the created_at of the most recent Message message in each thread, descending.
     *
     * @param array $inbox_ids the Inboxes to pull threads from
     *
     * @return array threadData
     */
    public static function getSorted(array $inbox_ids)
    {
        $t = self::with('users')->whereIn('inbox_id', $inbox_ids)
            ->get()
            ->sortByDesc(function ($thread) {
                if ($thread->snippet['empty']) { //if thread has no messages, we use thread creation time.
                    return $thread->created_at->toDateTimeString();
                }

                return $thread->snippet->created_at->toDateTimeString();
            });

        return $t->values()->all();
    }

    public function getUserIdsWithReadWriteAccess()
    {
        $thisThread = self::with('inbox.groups.users')->find($this->id);
        if(!$thisThread->inbox || !$thisThread->inbox->groups)
            return [];
        return $thisThread->inbox->groups
            ->filter(function ($group) {
                return $group->pivot->permission === Group::INBOX_PERMISSION_READWRITE;
            })->transform(function ($group) {
                return $group->users->pluck('id');
            })->flatten()->unique()->values()->all();
    }

    /**
     * TODO: invalidate assignments cache when group_user or group_inbox membership changes
     */
    public function invalidateCache() {
        Log::info("invalidating caches for thread #{$this->id}");
        Cache::tags("thread-{$this->id}")->flush();
    }

    public function assignUser($userId, $changedById) {
        $this->users()->syncWithoutDetaching($userId);
        User::find($changedById)->recordThreadEvent($this, UserEvent::TYPE_ASSIGN_THREAD, $userId);
        $this->invalidateCache();
    }
    public function unAssignUser($userId, $changedById) {
        $this->users()->detach($userId);
        User::find($changedById)->recordThreadEvent($this, UserEvent::TYPE_UNASSIGN_THREAD, $userId);
        $this->invalidateCache();
    }

    public function getAssignedUsers() {
        return Cache::tags(["permissions","thread-{$this->id}","inbox-{$this->inbox_id}"])
            ->rememberForever("thread-assignments-{$this->id}", function () {
            return $this->getAssignedUsersFresh();
        });

    }
    private function getAssignedUsersFresh()
    {
        $thread = self::with('users')->find($this->id);
        $user_ids_assigned = $thread->users->pluck('id')->toArray();
        $user_ids_with_readwrite = $thread->getUserIdsWithReadWriteAccess();

        //build a map: user_id <-> is_assigned
        $user_ids = [];
        foreach ($user_ids_with_readwrite as $u) {
            $user_ids[$u] = false;
        }
        foreach ($user_ids_assigned as $u) {
            $user_ids[$u] = true;
        }

        $users = [];
        foreach ($user_ids as $id => $v) {
            $user = User::find($id)->toArray();
            $user['assigned_to_thread'] = $v;
            $users[$id] = $user;
        }

        return $users;
    }

    public function getLastMessage($onlyIncoming = false)
    {
        if($onlyIncoming) {
            //todo: better way of determining incoming vs. outgoing then checking if user_id is null...
            return Message::where('thread_id', $this->id)->where('user_id',null)->orderBy('id', 'desc')->first();
        }
        return Message::where('thread_id', $this->id)->orderBy('id', 'desc')->first();
    }
}
