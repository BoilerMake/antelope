<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Draft extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function thread()
    {
        return $this->belongsTo('App\Models\Thread');
    }
}
