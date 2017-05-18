<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use App\Models\UserEvent;
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

    public function testChangeThreadAssignments()
    {
        $user1 = factory(User::class)->create();
        $user2 = factory(User::class)->create();
        $user3 = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user1,$inbox);
        TestCase::connectUserToInbox($user2,$inbox);
        TestCase::connectUserToInbox($user3,$inbox,Group::INBOX_PERMISSION_READONLY);
        $thread_id = $inbox->threads[0]->id;
        $token = $user1->getToken();
        $response = $this->json('GET', "/thread/{$thread_id}/assignments", [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        //only 2 users have READWRITE permission
        $data = $response->json()['data'];
        $this->assertEquals(2,count($data));

        //assign user2 to the thread.
        $data[$user2->id]['assigned_to_thread'] = true;
        $response = $this->json('PUT', "/thread/{$thread_id}/assignments", $data, ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseHas('thread_user',['thread_id'=>$thread_id,'user_id'=>$user2->id]);
        $this->assertDatabaseMissing('thread_user',['thread_id'=>$thread_id,'user_id'=>$user1->id]);
        $this->assertDatabaseHas('user_events',['user_id'=>$user1->id,'thread_id'=>$thread_id,'target_user_id'=>$user2->id,'type'=>UserEvent::TYPE_ASSIGN_THREAD]);


        //unassign user2 to the thread.
        $data[$user2->id]['assigned_to_thread'] = false;
        $response = $this->json('PUT', "/thread/{$thread_id}/assignments", $data, ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseMissing('thread_user',['thread_id'=>$thread_id,'user_id'=>$user2->id]);
        $this->assertDatabaseMissing('thread_user',['thread_id'=>$thread_id,'user_id'=>$user1->id]);
        $this->assertDatabaseHas('user_events',['user_id'=>$user1->id,'thread_id'=>$thread_id,'target_user_id'=>$user2->id,'type'=>UserEvent::TYPE_UNASSIGN_THREAD]);


        $response = $this->json('GET', '/thread/'.$thread_id, [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(2,count($response->json()['data']['user_events']));


    }
}
