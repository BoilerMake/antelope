<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    protected $fillable = ['inbox_id', 'state'];
    protected $appends = ['snippet'];

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
     *
     * @return mixed
     */
    public function getSnippetAttribute()
    {
        return $this->messages()->orderBy('created_at', 'desc')->first();
    }
}
