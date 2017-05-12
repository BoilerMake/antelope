<?php

namespace Tests\Unit;

use App\Models\Inbox;
use App\Models\Message;
use App\Models\User;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $this->assertTrue(true);
    }
    public function testSendingMail()
    {
        $inbox1 = factory(Inbox::class)->create();
        $sender = factory(User::class)->create();
        $faker = \Faker\Factory::create();
        $to = $faker->email;
        $message1 = Message::newMessage($inbox1->id,$sender->id,$to,'subject','<h1>body</h1>');

        //send a reply
        $message1->reply($sender->id,'aa');

    }
}
