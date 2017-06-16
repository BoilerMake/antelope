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
    protected $appends = ['snippet', 'messageCount'];

    const STATE_NEW = 'new';
    const STATE_ASSIGNED = 'assigned';
    const STATE_IN_PROGRESS = 'in-progress';
    const STATE_DONE = 'done';

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

    /**
     * Provides a snippet, to be used for the thread list.
     * This is the most recent message in the thread (chronologically).
     *
     * @return mixed
     */
    public function getSnippetAttribute()
    {
        return $this->messages()->orderBy('created_at', 'desc')->first();
    }

    /**
     * Gets the number of messages in a thread.
     *
     * @return int count
     */
    public function getMessageCountAttribute()
    {
        return $this->messages()->count();
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
                if ($thread->snippet == null) { //if thread has no messages, we use thread creation time.
                    return $thread->created_at->toDateTimeString();
                }

                return $thread->snippet->created_at->toDateTimeString();
            });

        return $t->values()->all();
    }

    public function getUserIdsWithReadWriteAccess()
    {
        return self::with('inbox.groups.users')
            ->find($this->id)->inbox->groups
            ->filter(function ($group) {
                return $group->pivot->permission === Group::INBOX_PERMISSION_READWRITE;
            })->transform(function ($group) {
                return $group->users->pluck('id');
            })->flatten()->unique()->values()->all();
    }
    public static function invalidateCache($thread_id) {
        Cache::tags("thread-{$thread_id}")->flush();
    }

    public function assignUser(User $user) {
        $this->users()->syncWithoutDetaching($user->id);
        $user->recordThreadEvent($this, UserEvent::TYPE_ASSIGN_THREAD, $user->id);
    }

    public function getAssignedUsers() {
//        $cacheKey = "thread-assignments-{$this->id}";
//        $value = Cache::tags(['thread',"thread-{$this->id}"])->remember($cacheKey, 10, function () {
//            return $this->getAssignedUsersFresh();
//        });
//        return $value;
        return $this->getAssignedUsersFresh();

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
