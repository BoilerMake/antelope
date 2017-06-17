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
use App\Models\Draft;
use App\Models\Group;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Support\Str;

$factory->define(User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'first_name'        => $faker->firstName,
        'last_name'         => $faker->lastName,
        'email'             => $faker->unique()->safeEmail,
        'password'          => $password ?: $password = bcrypt('secret'),
        'confirmation_code' => Str::random(10),
    ];
});

$factory->define(Inbox::class, function (Faker\Generator $faker) {
    return [
        'name'              => 'inb'.$faker->word,
        'primary_address'   => $faker->unique()->safeEmail,
        'regex'             => '',
    ];
});
$factory->define(Group::class, function (Faker\Generator $faker) {
    return [
        'name'              => 'gr'.$faker->word,
    ];
});
$factory->define(Thread::class, function (Faker\Generator $faker) {
    return [
        'state'              => Thread::STATE_NEW,
        'inbox_id'           => function () {
            return factory(Inbox::class)->create()->id;
        },
    ];
});
$factory->define(Draft::class, function (Faker\Generator $faker) {
    return [
        'user_id'            => function () {
            return factory(User::class)->create()->id;
        },
        'thread_id'          => function () {
            return factory(Thread::class)->create()->id;
        },
        'body'               => '<br/>some signature<br/>',
        'from'               => $faker->safeEmail,
    ];
});
$factory->define(Message::class, function (Faker\Generator $faker) {
    $fromEmail = $faker->email;
    $messageId1 = "<{$faker->uuid}@mail.domain.com>";

    return [
        'from'           => "{$faker->name} <{$fromEmail}>",
        'sender'         => $fromEmail,
        'subject'        => $faker->sentence(),
        'recipient'      => $faker->email,
        'to'      => $faker->email,
        'message_id'     => $messageId1,
        'body_plain'     => 'plain:'.$faker->sentence(10),
        'body_html'      => $faker->randomHtml(2, 3),
        'references'     => '',
        'in_reply_to'    => '',
        'headers'        => '',
        'timestamp'      => '123',
        'thread_id'      => function () {
            return factory(Thread::class)->create()->id;
        },
    ];
});
