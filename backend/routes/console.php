<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Display an inspiring quote');

Artisan::command('user:create {email} {--admin}', function ($email, $admin) {
    $this->info("Creating user for {$email}!");
    if ($admin) {
        $this->info('Admin user');
    }
    $user = User::addNew($email, $admin);
    $this->info($user->getToken());
});
