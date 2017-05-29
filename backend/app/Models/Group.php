<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use SoftDeletes;
    const INBOX_PERMISSION_READONLY = 'read';
    const INBOX_PERMISSION_READWRITE = 'readwrite';
    protected $guarded = ['id'];

    public function inboxes()
    {
        return $this->belongsToMany('App\Models\Inbox')->withPivot('permission');
    }

    public function users()
    {
        return $this->belongsToMany('App\Models\User');
    }

    public function getPermissionsForInbox($inboxId)
    {
        $base = DB::table('group_inbox')->whereGroupId($this->id)->whereInboxId($inboxId);
        if (!$base->count() > 0) {
            return 'none';
        }

        return $base->select('permission')->get()->pluck('permission')[0];
    }
}
