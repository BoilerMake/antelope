<?php

namespace Tests\Feature;

use App\Models\Message;
use Tests\TestCase;

class MailBasicTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testMailgunHookInvalidAuth()
    {
        putenv('MAILGUN_IGNORE_SIGNATURE=false');
        $response = $this->json('POST', '/mailgunhook');
        $response
            ->assertJson([
                'success' => false,
                'message' => 'mailgun signature invalid',
            ]);
    }

    public function testMailgunHook()
    {
        self::makeSeededInbox();
        putenv('MAILGUN_IGNORE_SIGNATURE=true');
        $faker = \Faker\Factory::create();
        //now let's send a message
        $fromEmail = $faker->email;
        $messageId1 = "<{$faker->uuid}@mail.domain.com>";
        $response = $this->json('POST', '/mailgunhook', [
            'from'            => "{$faker->name} <{$fromEmail}>",
            'sender'          => $fromEmail,
            'subject'         => $faker->sentence(),
            'recipient'       => $faker->email,
            'Message-Id'      => $messageId1,
            'body-plain'      => 'txt',
            'body-html'       => $faker->randomHtml(),
            'References'      => '',
            'In-Reply-To'     => '',
            'message-headers' => '',
            'timestamp'       => '123',
        ]);
        $response
            ->assertJson([
                'success' => true,
            ]);

        //now let's send a message that's a reply to the first one
        $fromEmail = $faker->email;
        $messageId2 = "<{$faker->uuid}@mail.domain.com>";
        $response = $this->json('POST', '/mailgunhook', [
            'from'            => "{$faker->name} <{$fromEmail}>",
            'sender'          => $fromEmail,
            'subject'         => "Re: {$faker->sentence()}",
            'recipient'       => $faker->email,
            'Message-Id'      => $messageId2,
            'body-plain'      => 'txt',
            'body-html'       => $faker->randomHtml(),
            'References'      => '',
            'In-Reply-To'     => $messageId1,
            'message-headers' => '',
            'timestamp'       => '123',
        ]);
        $response
            ->assertJson([
                'success' => true,
            ]);
        $m1 = Message::where('message_id', $messageId1)->first();
        $m2 = Message::where('message_id', $messageId2)->first();
        //both the messages should be in the same thread
        $this->assertEquals($m1->thread_id, $m2->thread_id);
        $this->assertEquals($m1->thread->inbox, $m2->thread->inbox);
    }

    public function testMailgunEventInvalidAuth()
    {
        putenv('MAILGUN_IGNORE_SIGNATURE=false');
        $response = $this->json('POST', '/mailgunevent');
        $response
            ->assertJson([
                'success' => false,
                'message' => 'mailgun signature invalid',
            ]);
    }

    public function testMailgunEvent()
    {
        putenv('MAILGUN_IGNORE_SIGNATURE=true');
        $faker = \Faker\Factory::create();
        $response = $this->json('POST', '/mailgunevent', [
            'antelope-message-id' => factory(Message::class)->create()->id,
            'recipient'           => $faker->email,
            'event'               => 'opened',
            'timestamp'           => '123',
        ]);
        $response
            ->assertJson([
                'success' => true,
            ]);
    }
}
