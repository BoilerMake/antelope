<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Tests\TestCase;

class UserInboxTest extends TestCase
{
    /**
     * Test GET /users/me/inboxes.
     */
    public function testGetMyInboxes()
    {
        $inbox = self::makeSeededInbox(4);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user,$inbox);
        $token = $user->getToken();
        $response = $this->json('GET', '/users/me/inboxes', [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [['id'=>0],['id'=>$inbox->id]],
            ]);
    }

    /**
     * Test GET inbox/{id}.
     */
    public function testGetSingleInboxById()
    {

        $inbox = self::makeSeededInbox(4);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user,$inbox);
        $token = $user->getToken();
        $response = $this->json('GET', '/inbox/'.$inbox->id, [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(4,count($response->json()['data']['threads']));
    }

    /**
     * Test GET inbox/0.
     */
    public function testGetAllUserInboxes()
    {
        $inbox = self::makeSeededInbox(4);
        $inbox_2 = self::makeSeededInbox(3);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user,$inbox);
        self::connectUserToInbox($user,$inbox_2);
        $token = $user->getToken();
        $response = $this->json('GET', '/inbox/0', [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(7,count($response->json()['data']['threads']));
    }

    /**
     * Test GET thread/{id}.
     */
    public function testGetThread()
    {
        $inbox = self::makeSeededInbox(1,5);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user,$inbox);
        $token = $user->getToken();
        $response = $this->json('GET', '/thread/'.$inbox->threads[0]->id, [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(5,count($response->json()['data']['messages']));
    }
}
