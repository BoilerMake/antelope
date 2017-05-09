<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    protected $fillable = ['inbox_id'];
    public function inbox()
    {
        return $this->belongsTo('App\Models\Inbox');
    }
}
