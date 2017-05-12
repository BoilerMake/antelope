<?php
/**
 * Created by PhpStorm.
 * User: nickysemenza
 * Date: 5/11/17
 * Time: 9:45 PM.
 */

namespace Tests\Unit;

use App\Models\User;
use Tests\TestCase;

class CommandsTest extends TestCase
{
    public function testCreateUserNonAdmin()
    {
        $faker = \Faker\Factory::create();
        $email = $faker->email;
        $this->artisan('user:create', [
            'email'=> $email,
        ]);
        $this->assertDatabaseHas('users', ['email'=>$email, 'is_admin'=>false]);
    }

    public function testCreateUserAdmin()
    {
        $faker = \Faker\Factory::create();
        $email = $faker->email;
        $this->artisan('user:create', [
            'email'  => $email,
            '--admin'=> true,
        ]);
        $this->assertDatabaseHas('users', ['email'=>$email, 'is_admin'=>true]);
    }
}
