<?php

namespace App\Models;

use Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inbox extends Model
{
    use SoftDeletes;
    use CacheableModel;
    protected $appends = ['countNew'];
    protected $guarded = ['id'];

    public function getCountNewAttribute()
    {
        return $this->counts()[Thread::STATE_NEW];
    }

    /**
     * isCached.
     *
     * @return mixed
     */
    public function counts()
    {
        return Cache::tags([$this->getCacheTag()])
            ->rememberForever("inbox-counts-{$this->id}", function () {
                return [
                    Thread::STATE_NEW         => $this->threads()->where('state', Thread::STATE_NEW)->count(),
                    Thread::STATE_ASSIGNED    => $this->threads()->where('state', Thread::STATE_ASSIGNED)->count(),
                    Thread::STATE_IN_PROGRESS => $this->threads()->where('state', Thread::STATE_IN_PROGRESS)->count(),
                    Thread::STATE_DONE        => $this->threads()->where('state', Thread::STATE_DONE)->count(),
                ];
            });
    }

    /**
     * Invalidate the thread cache: basically when the state of a thread changes.
     *
     * @param $inbox_id
     */
    public static function invalidateCacheById($inbox_id)
    {
        self::find($inbox_id)->invalidateCache();
    }

    public function reBuildCache()
    {
        $this->invalidateCache();
        $this->counts();
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
