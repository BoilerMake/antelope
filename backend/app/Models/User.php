<?php

namespace App\Models;

use Hash;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['*'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    public static function addNew($email, $admin)
    {
        $user = new self();
        $user->email = $email;
        $user->is_admin = $admin;
        //set a temporary password
        $tempPassword = 'test'; //Str::random(10)
        $user->password = Hash::make($tempPassword);
        $user->save();
        //no chance of collision if we prepend a random string with the unique id
        $user->confirmation_code = $user->id.Str::random(10);
        $user->save();

        return $user;
    }

    public function getToken()
    {
        return JWTAuth::fromUser($this, ['exp' => strtotime('+1 year')]);
    }
}
