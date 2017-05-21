<?php

namespace Tests\Feature;

use App\Models\Draft;
use App\Models\Group;
use App\Models\Inbox;
use App\Models\Thread;
use App\Models\User;
use App\Models\UserEvent;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    public function testGetInboxSettingsAsAdmin()
    {
        $user = factory(User::class)->create();
        $user->is_admin = true;
        $user->save();
        $token = $user->getToken();
        $response = $this->json('GET', "/settings/inboxes", [], ['Authorization' => 'Bearer ' . $token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
    public function testGetInboxSettingsAsNonAdmin()
    {
        $user = factory(User::class)->create();
        $token = $user->getToken();
        $response = $this->json('GET', "/settings/inboxes", [], ['Authorization' => 'Bearer ' . $token]);
        $response
            ->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }
}
