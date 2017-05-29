<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Inbox extends Model
{
    use SoftDeletes;
    protected $appends = ['countNew'];
    protected $guarded = ['id'];

    public function getCountNewAttribute()
    {
        return $this->threads()->where('state', Thread::STATE_NEW)->count();
    }

    public function counts()
    {
        return [
                Thread::STATE_NEW         => $this->threads()->where('state', Thread::STATE_NEW)->count(),
                Thread::STATE_ASSIGNED    => $this->threads()->where('state', Thread::STATE_ASSIGNED)->count(),
                Thread::STATE_IN_PROGRESS => $this->threads()->where('state', Thread::STATE_IN_PROGRESS)->count(),
                Thread::STATE_DONE        => $this->threads()->where('state', Thread::STATE_DONE)->count(),
            ];
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
