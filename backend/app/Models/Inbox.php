<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inbox extends Model
{
    public function groups()
    {
        return $this->belongsToMany('App\Models\Group')->withPivot('permission');
    }
    public function threads()
    {
        return $this->hasMany('App\Models\Thread');
    }
}
