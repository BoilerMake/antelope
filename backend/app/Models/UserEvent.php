<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserEvent extends Model
{
    const TYPE_ASSIGN_THREAD = 'assign_thread';
    const TYPE_UNASSIGN_THREAD = 'unassign_thread';
    const TYPE_CREATE_DRAFT = 'create_draft';
    const TYPE_SEND_DRAFT = 'send_draft';
    const TYPE_DELETE_DRAFT = 'delete_draft';
    const TYPE_UPDATE_GROUP_INBOX_PERMISSIONS = 'update_group_inbox_permissions';
    const TYPE_GROUP_USER_ADD = 'group_user_add';
    const TYPE_GROUP_USER_REMOVE = 'group_user_remove';
    const TYPE_CREATE_THREAD = 'create_thread';
    protected $guarded = ['id'];

    public static function record(User $user, User $target, $type, array $meta)
    {
        self::create([
            'user_id'        => $user ? $user->id : null,
            'target_user_id' => $target ? $target->id : null,
            'type'           => $type,
            'meta'           => $meta ? json_encode($meta) : null,
        ]);
    }

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
        return $this->belongsTo('App\Models\Inbox');
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
