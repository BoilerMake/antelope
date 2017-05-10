<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    const INBOX_PERMISSION_READONLY = 'read';
    const INBOX_PERMISSION_READWRITE = 'readwrite';
    public function inboxes()
    {
        return $this->belongsToMany('App\Models\Inbox')->withPivot('permission');
    }
    public function users()
    {
        return $this->belongsToMany('App\Models\User');
    }
}
