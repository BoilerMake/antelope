<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class UserInboxTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testGetMyInboxes()
    {
        $user1 = factory(User::class)->create();
        $token = $user1->getToken();
        $response = $this->json('GET', '/users/me/inboxes', [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [['id'=>0]],
            ]);
    }
}
