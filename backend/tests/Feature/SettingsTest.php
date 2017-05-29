<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Inbox;
use App\Models\Thread;
use App\Models\User;
use App\Models\UserEvent;
use Faker\Factory;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    public function testGetInboxSettingsAsAdmin()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/inboxes', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertEquals(Inbox::count(), count($response->json()['data']));
    }

    /**
     * We shouldn't be able to access settings route if we aren't admin, thanks to the AdminOnly middleware.
     */
    public function testGetInboxSettingsAsNonAdmin()
    {
        $user = factory(User::class)->create();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/inboxes', [], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Should be able to change properties of an inbox, as well as create an inbox.
     */
    public function testCreateUpdateInboxSettings()
    {
        $faker = Factory::create();
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/inboxes', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $data = $response->json()['data'];
        $changedInboxName = $faker->firstName;
        $newInboxName = $faker->userName;
        $data[0]['name'] = $changedInboxName;
        $data[] = [
            'id'             => null,
            'name'           => $newInboxName,
            'regex'          => 'regex',
            'primary_address'=> $faker->email,
        ];
        $response = $this->json('PUT', '/settings/inboxes', $data, ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('inboxes', ['id'=>$data[0]['id'], 'name'=>$changedInboxName]);
        $this->assertDatabaseHas('inboxes', ['name'=>$newInboxName]);
    }


    public function testGetUserEvents()
    {
        $user = factory(User::class)->create();
        $user->recordThreadEvent(factory(Thread::class)->create(),UserEvent::TYPE_UNASSIGN_THREAD);
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/userevents', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertEquals(UserEvent::count(), count($response->json()['data']));
    }
    public function testGetUsers()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/users', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertEquals(User::count(), count($response->json()['data']));
    }
    public function testChangeGroupInboxMatrix()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/groupinboxmatrix', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);

        $data = $response->json()['data'];
        $groupId = factory(Group::class)->create()->id;
        $inboxId = factory(Inbox::class)->create()->id;
        $inboxId2 = factory(Inbox::class)->create()->id;

        Inbox::find($inboxId)->groups()->sync([$groupId => ['permission' => Group::INBOX_PERMISSION_READWRITE]]);
        Inbox::find($inboxId2)->groups()->sync([$groupId => ['permission' => Group::INBOX_PERMISSION_READWRITE]]);

        $data[$groupId]['permissions'][$inboxId] = Group::INBOX_PERMISSION_READONLY;
        $data[$groupId]['permissions'][$inboxId2] = "none";

        $response = $this->json('PUT', '/settings/groupinboxmatrix', $data, ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('group_inbox', [
            'group_id'=>$groupId,
            'inbox_id'=>$inboxId,
            'permission'=>Group::INBOX_PERMISSION_READONLY,
        ]);
    }
    public function testUnChangedGroupInboxMatrix()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/groupinboxmatrix', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);

        $data = $response->json()['data'];

        $response = $this->json('PUT', '/settings/groupinboxmatrix', $data, ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
    }
    public function testCreateGetGroup() {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $faker = Factory::create();
        $name = $faker->userName;
        $response = $this->json('POST', '/settings/groups', ['name'=>$name], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('groups',['name'=>$name]);

        $id = $response->json()['data']['id'];
        $response = $this->json('GET', '/settings/groups/'.$id, ['name'=>$name], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertJson([
                'success' => true,
                'data'=>['id'=>$id]
            ]);
    }
    public function testGetGroups()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/groups', [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertEquals(Group::count(), count($response->json()['data']));
    }
    public function testChangeGroupMembership() {
        $user = factory(User::class)->create();
        $group = factory(Group::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('PUT', "/settings/groups/{$group->id}/users/{$user->id}", ['action'=>'add'], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('group_user',['user_id'=>$user->id,'group_id'=>$group->id]);
        $response = $this->json('PUT', "/settings/groups/{$group->id}/users/{$user->id}", ['action'=>'remove'], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseMissing('group_user',['user_id'=>$user->id,'group_id'=>$group->id]);
    }
    public function testCreateUser() {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $faker = Factory::create();
        $email = $faker->email;
        $response = $this->json('POST', '/settings/users', ['email'=>$email], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('users',['email'=>$email]);

        //and we shouldn't be able to create a new user with used email.
        $response = $this->json('POST', '/settings/users', ['email'=>$email], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertJson([
                'success' => false,
            ]);
    }
    public function testGetSetUser()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();

        $user2 = factory(User::class)->create();
        $response = $this->json('GET', "/settings/users/{$user2->id}", [], ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);

        $data = $response->json()['data'];
        $data['is_admin'] = true;

        $response = $this->json('PUT', "/settings/users/{$user2->id}", $data, ['Authorization' => 'Bearer '.$token]);
        $response->assertJson(['success' => true]);
        $user2 = $user2->fresh();
        self::assertEquals($user2->is_admin,1);
    }
}
