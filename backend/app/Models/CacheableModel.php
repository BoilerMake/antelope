<?php

namespace App\Models;

use Cache;
use Log;

trait CacheableModel
{
    public function invalidateCache()
    {
        $caller = __CLASS__;
        $tag = $this->getCacheTag();
        Log::info("CashFlush: {$caller} #{$this->id}, tag: {$tag}");
        Cache::tags($tag)->flush();
    }

    public function getCacheTag()
    {
        return "{$this->getTable()}-{$this->id}";
    }
}
