<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Draft extends Model
{
    protected $guarded = ['id'];

    public function thread()
    {
        return $this->belongsTo('App\Models\Thread');
    }
}
