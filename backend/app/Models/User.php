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

    public function groups()
    {
        return $this->belongsToMany('App\Models\Group');
    }

    public static function addNew($email, $admin=false)
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
    private function getInboxIdsByPermission() {
        $user = User::with('groups.inboxes')->find($this->id);
        $inboxes_by_permission = [];
        foreach ($user->groups as $group) {
            foreach($group->inboxes as $eachGroupInbox) {
                $inboxes_by_permission[$eachGroupInbox->pivot->permission][]=$eachGroupInbox->id;
            }
        }
        $r = $inboxes_by_permission[Group::INBOX_PERMISSION_READONLY];
        $rw = $inboxes_by_permission[Group::INBOX_PERMISSION_READWRITE];

        //we prioritize readwrite higher than readonly, so if a user has readonly AND readwrite permissions from
        //  two different groups, then we ignore the readonly, letting the readwrite take precedence.
        return [
            'readOnly_ids'=> array_values(array_diff($r,$rw)),
            'readWrite_ids'=> $rw,
            'all_ids'=> array_unique(array_merge($r,$rw))];
    }
    public function getInboxIds() {
        return self::getInboxIdsByPermission()['all_ids'];
    }
}
