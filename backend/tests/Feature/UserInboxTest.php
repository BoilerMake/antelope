<?php

namespace Tests\Feature;

use App\Models\Draft;
use App\Models\Group;
use App\Models\Inbox;
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
        self::connectUserToInbox($user, $inbox);
        $token = $user->getToken();
        $response = $this->json('GET', '/users/me/inboxes', [], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [['id' => 0], ['id' => $inbox->id]],
            ]);
        $inbox->delete();
    }

    /**
     * Test GET inbox/{id}.
     */
    public function testGetSingleInboxById()
    {
        $inbox = self::makeSeededInbox(4);
        factory(Thread::class)->create(['inbox_id'=>$inbox->id]);

        $user = factory(User::class)->create();
        self::connectUserToInbox($user, $inbox);
        $response = $this->json('GET', '/inbox/'.$inbox->id, [], ['Authorization' => 'Bearer '.$user->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals(5, count($response->json()['data']['threads']));
        $inbox->delete();
    }

    /**
     * Test GET inbox/{id}.
     */
    public function testGetSingleInboxByIdWithSearch()
    {
        $inbox = self::makeSeededInbox(4);
        factory(Thread::class)->create(['inbox_id'=>$inbox->id]);

        $user = factory(User::class)->create();
        self::connectUserToInbox($user, $inbox);
        $response = $this->json('GET', '/inbox/'.$inbox->id, ['query'=>'plain'], ['Authorization' => 'Bearer '.$user->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertNotEquals(0, count($response->json()['data']['threads']));
        $inbox->delete();
    }

    /**
     * Test GET inbox/{id} where user does not have access.
     */
    public function testGetSingleInboxByIdNoPermission()
    {
        $inbox = self::makeSeededInbox();
        $user = factory(User::class)->create();
        //not giving the user permissions for the inbox now
        $response = $this->json('GET', '/inbox/'.$inbox->id, [], ['Authorization' => 'Bearer '.$user->getToken()]);
        $response
            ->assertStatus(403)
            ->assertJson(['success' => false]);
        $inbox->delete();
    }

    /**
     * Test GET inbox/0.
     */
    public function testGetAllUserInboxes()
    {
        $inbox = self::makeSeededInbox(4);
        $inbox_2 = self::makeSeededInbox(3);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user, $inbox);
        self::connectUserToInbox($user, $inbox_2);
        $token = $user->getToken();
        $response = $this->json('GET', '/inbox/0', [], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(7, count($response->json()['data']['threads']));
        $inbox_2->delete();
        $inbox->delete();
    }

    /**
     * Test GET thread/{id}.
     */
    public function testGetThreadById()
    {
        $inbox = self::makeSeededInbox(1, 5);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user, $inbox);
        $response = $this->json('GET', '/thread/'.$inbox->threads[0]->id, [], ['Authorization' => 'Bearer '.$user->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson(['success' => true, 'data'=>['readOnly'=>false]]);
        $this->assertEquals(5, count($response->json()['data']['messages']));
        $inbox->delete();
    }

    /**
     * Test GET thread/{id}.
     */
    public function testGetThreadByIdReadOnly()
    {
        $inbox = self::makeSeededInbox(1, 5);
        $user = factory(User::class)->create();
        self::connectUserToInbox($user, $inbox, Group::INBOX_PERMISSION_READONLY);
        $response = $this->json('GET', '/thread/'.$inbox->threads[0]->id, [], ['Authorization' => 'Bearer '.$user->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson(['success' => true, 'data'=>['readOnly'=>true]]);
        $this->assertEquals(5, count($response->json()['data']['messages']));
        $inbox->delete();
    }

    /**
     * Test GET thread/{id}.
     */
    public function testGetThreadByIdNoPermission()
    {
        $inbox = self::makeSeededInbox(1, 5);
        $user = factory(User::class)->create();
        //no giving user inbox permission
        $response = $this->json('GET', '/thread/'.$inbox->threads[0]->id, [], ['Authorization' => 'Bearer '.$user->getToken()]);
        $response
            ->assertStatus(403)
            ->assertJson(['success' => false]);
        $inbox->delete();
    }

    /**
     * Tests getting the assignments for a thread (initial state is no assignments)
     * Then assigns some users to the thread, and ensures the UserEvent items are recorded as well.
     */
    public function testChangeThreadAssignments()
    {
        $user1 = factory(User::class)->create();
        $user2 = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user1, $inbox);
        TestCase::connectUserToInbox($user2, $inbox);
        $thread_id = $inbox->threads[0]->id;
        $response = $this->json('GET', "/thread/{$thread_id}/assignments", [], ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        //only 2 users have READWRITE permission
        $data = $response->json()['data'];
        $this->assertEquals(2, count($data));

        //assign user2 to the thread.
        $data[$user2->id]['assigned_to_thread'] = true;
        $response = $this->json('PUT', "/thread/{$thread_id}/assignments", $data, ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseHas('thread_user', ['thread_id' => $thread_id, 'user_id' => $user2->id]);
        $this->assertDatabaseMissing('thread_user', ['thread_id' => $thread_id, 'user_id' => $user1->id]);
        $this->assertDatabaseHas('user_events', ['user_id' => $user1->id, 'thread_id' => $thread_id, 'target_user_id' => $user2->id, 'type' => UserEvent::TYPE_ASSIGN_THREAD]);

        //unassign user2 to the thread.
        $data[$user2->id]['assigned_to_thread'] = false;
        $response = $this->json('PUT', "/thread/{$thread_id}/assignments", $data, ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseMissing('thread_user', ['thread_id' => $thread_id, 'user_id' => $user2->id]);
        $this->assertDatabaseMissing('thread_user', ['thread_id' => $thread_id, 'user_id' => $user1->id]);
        $this->assertDatabaseHas('user_events', ['user_id' => $user1->id, 'thread_id' => $thread_id, 'target_user_id' => $user2->id, 'type' => UserEvent::TYPE_UNASSIGN_THREAD]);

        //get the thread and make sure the events are there.
        $response = $this->json('GET', '/thread/'.$thread_id, [], ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertEquals(2, count($response->json()['data']['user_events']));
        $inbox->delete();
    }

    /**
     * Test trying to change thread assignments sans permission.
     */
    public function testChangeThreadAssignmentsNoPermission()
    {
        $user1 = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        $thread_id = $inbox->threads[0]->id;
        $response = $this->json('GET', "/thread/{$thread_id}/assignments", [], ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);

        //assign user2 to the thread.
        $data[$user1->id]['assigned_to_thread'] = true;
        $response = $this->json('PUT', "/thread/{$thread_id}/assignments", ['somedata'], ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
        $this->assertDatabaseMissing('thread_user', ['thread_id' => $thread_id, 'user_id' => $user1->id]);
        $inbox->delete();
    }

    /**
     * Test trying to change thread assignments with read only permission
     * These assignments should thusly be read only.
     */
    public function testChangeThreadAssignmentsWithReadOnlyPermission()
    {
        $user1 = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user1, $inbox, Group::INBOX_PERMISSION_READONLY);
        $thread_id = $inbox->threads[0]->id;
        $response = $this->json('GET', "/thread/{$thread_id}/assignments", [], ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        //assign user2 to the thread.
        $data[$user1->id]['assigned_to_thread'] = true;
        $response = $this->json('PUT', "/thread/{$thread_id}/assignments", ['somedata'], ['Authorization' => 'Bearer '.$user1->getToken()]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
        $this->assertDatabaseMissing('thread_user', ['thread_id' => $thread_id, 'user_id' => $user1->id]);
        $inbox->delete();
    }

    /**
     * Tests creating a draft, updating the data, and sending it.
     */
    public function testCreateSaveSendDraft()
    {
        $user = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user, $inbox);
        $thread_id = $inbox->threads[0]->id;
        $token = $user->getToken();
        $response = $this->json('POST', "/thread/{$thread_id}/drafts", [], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('user_events', ['user_id' => $user->id, 'thread_id' => $thread_id, 'type' => UserEvent::TYPE_CREATE_DRAFT]);

        $data = $response->json()['data'];
        //todo: check user signature is in there

        //todo: make sure the draft is in there
        $response = $this->json('GET', "/thread/{$thread_id}", [], ['Authorization' => 'Bearer '.$token]);
        $response->assertStatus(200);

        //assign user2 to the thread.
        $data['body'] = '<p>newhtml</p>';
        $response = $this->json('PUT', "/drafts/{$data['id']}/send", $data, ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseHas('drafts', ['thread_id' => $thread_id, 'body' => $data['body']]);
        $inbox->delete();

        // Check Delete
        $this->assertDatabaseMissing('drafts', [
            'thread_id' => $thread_id,
            'body'      => $data['body'],
        ]);
    }

    public function testCreateSaveSendDraftWithCcAndBcc()
    {
        $user = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user, $inbox);
        $thread_id = $inbox->threads[0]->id;
        $token = $user->getToken();
        $response = $this->json('POST', "/thread/{$thread_id}/drafts", [], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('user_events', ['user_id' => $user->id, 'thread_id' => $thread_id, 'type' => UserEvent::TYPE_CREATE_DRAFT]);

        $data = $response->json()['data'];
        //todo: check user signature is in there

        //todo: make sure the draft is in there
        $response = $this->json('GET', "/thread/{$thread_id}", [], ['Authorization' => 'Bearer '.$token]);
        $response->assertStatus(200);

        //assign user2 to the thread.
        $data['body'] = '<p>newhtml</p>';
        $data['bcc'] = 'test@test.com';
        $data['cc'] = 'test@test.com';
        $response = $this->json('PUT', "/drafts/{$data['id']}/send", $data, ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseHas('drafts', ['thread_id' => $thread_id, 'body' => $data['body']]);
        $inbox->delete();
    }

    public function testCreateDrafttNoPermission()
    {
        $user = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        $thread_id = $inbox->threads[0]->id;
        $token = $user->getToken();
        $response = $this->json('POST', "/thread/{$thread_id}/drafts", [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
        $inbox->delete();
    }

    public function testCreateDraftReadOnlyPermission()
    {
        $user = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user, $inbox, Group::INBOX_PERMISSION_READONLY);
        $thread_id = $inbox->threads[0]->id;
        $token = $user->getToken();
        $response = $this->json('POST', "/thread/{$thread_id}/drafts", [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
        $inbox->delete();
    }

    public function testSendDraftNotYours()
    {
        $user = factory(User::class)->create();
        $token = $user->getToken();
        $draft_id = factory(Draft::class)->create()->id;
        $response = $this->json('PUT', "/drafts/{$draft_id}/send", ['randomdata'], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function testCreateThreadAndDraft()
    {
        $user = factory(User::class)->create();
        $inbox = TestCase::makeSeededInbox();
        TestCase::connectUserToInbox($user, $inbox);
        $token = $user->getToken();

        //make a thread
        $response = $this->json('POST', "/inbox/{$inbox->id}/threads", [], ['Authorization' => 'Bearer '.$token]);
        $response->assertStatus(200);
        $newThreadId = $response->json()['data']['id'];

        $response = $this->json('POST', "/thread/{$newThreadId}/drafts", [], ['Authorization' => 'Bearer '.$token]);
        $response->assertStatus(200);
    }
}
