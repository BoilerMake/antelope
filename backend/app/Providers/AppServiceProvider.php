<?php

namespace App\Providers;

use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //travis doesn't seem to support mysql 5.7.7 yet: https://laravel-news.com/laravel-5-4-key-too-long-error
        Schema::defaultStringLength(191);

        //whenever a new thread is created, or is updated (i.e. new or state change)
        Thread::saved(function ($thread) {
            Inbox::invalidateCacheById($thread->inbox_id);
        });

        Message::saved(function ($message) {
            Thread::invalidateCacheById($message->thread_id);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->environment() !== 'production') {
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
            $this->app->register(\Laracasts\Generators\GeneratorsServiceProvider::class);
        }
    }
}
