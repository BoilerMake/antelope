<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageEvent extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['raw'];
}
