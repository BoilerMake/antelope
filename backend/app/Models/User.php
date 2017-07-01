<?php

namespace App\Models;

use Cache;
use Hash;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class User extends Authenticatable
{
    use Notifiable;
    use SoftDeletes;
    use CacheableModel;

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
        'confirmation_code',
    ];
    protected $appends = ['displayName'];

    public function groups()
    {
        return $this->belongsToMany('App\Models\Group');
    }

    public function getDisplayNameAttribute()
    {
        //        return "{$this->first_name} {$this->last_name} (#{$this->id})";
        $last = substr($this->last_name, 0, 1);

        return "{$this->first_name} {$last}";
    }

    /**
     * Creates a new user.
     *
     * @param $email
     * @param bool $admin
     * @param null $password
     *
     * @return User|bool
     */
    public static function addNew($email, $admin = false, $password = null)
    {
        if (self::where('email', $email)->first()) {
            return false;
        }
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

    public function reBuildCache()
    {
        $this->invalidateCache();
        self::permissionsWereTangentiallyUpdated(__METHOD__);
        $this->getInboxIdsByPermission();
    }

    private function getInboxIdsByPermission()
    {
        return Cache::tags(['permissions', $this->getCacheTag()])
            ->rememberForever("user-inbox-permissions-{$this->id}", function () {
                return $this->getInboxIdsByPermissionFresh();
            });
    }

    /**
     * Gets inbox ids based on permission levels, taking into account readwrite > write precedence.
     * TODO: clean this up, do we want to handle 0 inboxes differently? (mainly for users/me/inboxes).
     *
     * @return array
     */
    private function getInboxIdsByPermissionFresh()
    {
        $user = self::with('groups.inboxes')->find($this->id);
        $inboxes_by_permission = [];
        foreach ($user->groups as $group) {
            foreach ($group->inboxes as $eachGroupInbox) {
                $inboxes_by_permission[$eachGroupInbox->pivot->permission][] = $eachGroupInbox->id;
            }
        }
        $r = [];
        $rw = [];
        if (isset($inboxes_by_permission[Group::INBOX_PERMISSION_READONLY])) {
            $r = $inboxes_by_permission[Group::INBOX_PERMISSION_READONLY];
        }
        if (isset($inboxes_by_permission[Group::INBOX_PERMISSION_READWRITE])) {
            $rw = $inboxes_by_permission[Group::INBOX_PERMISSION_READWRITE];
        }

        //we prioritize readwrite higher than readonly, so if a user has readonly AND readwrite permissions from
        //  two different groups, then we ignore the readonly, letting the readwrite take precedence.
        return [
            'readOnly_ids' => array_values(array_diff($r, $rw)),
            'readWrite_ids'=> $rw,
            'all_ids'      => array_unique(array_merge($r, $rw)), ];
    }

    public function getInboxIds()
    {
        return self::getInboxIdsByPermission()['all_ids'];
    }

    public function getReadWriteInboxIds()
    {
        return self::getInboxIdsByPermission()['readWrite_ids'];
    }

    public function recordThreadEvent(Thread $thread, $type, $target_user_id = null)
    {
        return UserEvent::create([
            'user_id'       => $this->id,
            'thread_id'     => $thread->id,
            'inbox_id'      => $thread->inbox_id,
            'target_user_id'=> $target_user_id,
            'type'          => $type,
        ]);
    }

    public static function permissionsWereTangentiallyUpdated($triggeredBy)
    {
        Log::info("going to invalidate caches related to user permissions (because of {$triggeredBy})");
        Cache::tags('permissions')->flush();
    }

    public function getSignupUrl()
    {
        return env('FRONTEND_URI')."/signup/{$this->confirmation_code}";
    }
}
