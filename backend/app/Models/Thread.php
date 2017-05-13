<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    protected $fillable = ['inbox_id', 'state'];
    protected $appends = ['snippet', 'messageCount'];

    const STATE_NEW = 'new';
    const STATE_ASSIGNED = 'assigned';
    const STATE_IN_PROGRESS = 'in_progress';
    const STATE_DONE = 'done';

    public function inbox()
    {
        return $this->belongsTo('App\Models\Inbox');
    }

    public function messages()
    {
        return $this->hasMany('App\Models\Message');
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
        $t = self::whereIn('inbox_id', $inbox_ids)
            ->get()
            ->sortByDesc(function ($thread) {
                if ($thread->snippet == null) {//edge case, todo: make this cleaner
                    return 0;
                }

                return $thread->snippet->created_at->toDateTimeString();
            });

        return $t->values()->all();
    }
}
