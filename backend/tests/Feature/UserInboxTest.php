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
     * Test GET /users/me/inboxes
     */
    public function testGetMyInboxes()
    {
        $user = factory(User::class)->create();
        $token = $user->getToken();
        $response = $this->json('GET', '/users/me/inboxes', [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [['id'=>0]],
            ]);
    }

    /**
     * Test GET inbox/{id}
     */
    public function testGetInbox()
    {
        $inboxes = factory(Inbox::class, 1)
            ->create()
            ->each(function ($u) {
                $u->threads()->save(factory(Thread::class)->make());
                $u->threads()->save(factory(Thread::class)->make());
                $u->threads()->save(factory(Thread::class)->make());
            });
        $inbox_1 = Inbox::find($inboxes[0]->id);

        $groupId = factory(Group::class)->create()->id;
        $inbox_1->groups()->attach($groupId, ['permission'=>Group::INBOX_PERMISSION_READWRITE]);
        $user = factory(User::class)->create();
        $user->groups()->attach($groupId);
        $token = $user->getToken();
        $response = $this->json('GET', '/inbox/'.$inbox_1->id, [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(sizeof($response->json()['data']['threads']),3);
    }

    /**
     * Test GET thread/{id}
     */
    public function testGetThread()
    {
        $threads = factory(Thread::class, 1)
            ->create()
            ->each(function ($u) {
                $u->messages()->save(factory(Message::class)->make());
                $u->messages()->save(factory(Message::class)->make());
                $u->messages()->save(factory(Message::class)->make());
            });
        $thread_1 = Thread::find($threads[0]->id);
        $inbox_1 = Inbox::find($threads[0]->inbox_id);

        $groupId = factory(Group::class)->create()->id;
        $inbox_1->groups()->attach($groupId, ['permission'=>Group::INBOX_PERMISSION_READWRITE]);
        $user = factory(User::class)->create();
        $user->groups()->attach($groupId);
        $token = $user->getToken();
        $response = $this->json('GET', '/thread/'.$thread_1->id, [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(sizeof($response->json()['data']['messages']),3);

    }
}
