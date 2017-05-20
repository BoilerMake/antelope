<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserEvent extends Model
{
    const TYPE_ASSIGN_THREAD = 'assign_thread';
    const TYPE_UNASSIGN_THREAD = 'unassign_thread';
    const TYPE_CREATE_DRAFT = 'create_draft';
    const TYPE_SEND_DRAFT = 'send_draft';
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function target()
    {
        return $this->belongsTo('App\Models\User', 'target_user_id');
    }

    public function inbox()
    {
        return $this->belongsTo('App\Models\Thread');
    }

    public function message()
    {
        return $this->belongsTo('App\Models\Message');
    }

    public function thread()
    {
        return $this->belongsTo('App\Models\Thread');
    }
}
