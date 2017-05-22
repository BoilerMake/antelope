<?php

namespace Tests\Feature;

use App\Models\Inbox;
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
        $response
            ->assertJson([
                'success' => true,
            ]);
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
        $response
            ->assertJson([
                'success' => true,
            ]);
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
        $response
            ->assertJson([
                'success' => true,
            ]);
        $this->assertDatabaseHas('inboxes', ['id'=>$data[0]['id'], 'name'=>$changedInboxName]);
        $this->assertDatabaseHas('inboxes', ['name'=>$newInboxName]);
    }

    public function testGetUserEvents()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', '/settings/userevents', [], ['Authorization' => 'Bearer '.$token]);
        $response
            ->assertJson([
                'success' => true,
            ]);
        $this->assertEquals(UserEvent::count(), count($response->json()['data']));
    }
}
