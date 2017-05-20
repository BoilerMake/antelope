<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inbox extends Model
{
    protected $appends = ['countNew'];

    public function getCountNewAttribute()
    {
        return $this->threads()->where('state', Thread::STATE_NEW)->count();
    }

    public function groups()
    {
        return $this->belongsToMany('App\Models\Group')->withPivot('permission');
    }

    public function threads()
    {
        return $this->hasMany('App\Models\Thread');
    }
}
