<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    protected $fillable = ['inbox_id','state'];

    const STATE_NEW = 'new';
    const STATE_ASSIGNED = 'assigned';
    const STATE_IN_PROGRESS = 'in_progress';
    const STATE_DONE = 'done';
    public function inbox()
    {
        return $this->belongsTo('App\Models\Inbox');
    }
}
