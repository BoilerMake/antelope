<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'first_name'     => $faker->name,
        'email'          => $faker->unique()->safeEmail,
        'password'       => $password ?: $password = bcrypt('secret'),
    ];
});

$factory->define(App\Models\Inbox::class, function (Faker\Generator $faker) {
    return [
        'name'              => 'inb'.$faker->word,
        'primary_address'   => $faker->unique()->safeEmail,
        'regex'             => '',
    ];
});
$factory->define(App\Models\Group::class, function (Faker\Generator $faker) {
    return [
        'name'              => 'gr'.$faker->word,
    ];
});
