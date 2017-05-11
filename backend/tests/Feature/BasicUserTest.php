<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class BasicUserTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testSignin()
    {
        $user1 = factory(User::class)->create();

        $response = $this->json('POST', '/auth/login', ['email' => $user1->email, 'password'=>'secret']);
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data'=>['token']])
            ->assertJson([
                'success' => true,
            ]);

        $response = $this->json('POST', '/auth/login', ['email' => $user1->email]);
        $response
            ->assertJson([
                'success' => false,
                'message' => ['The password field is required.'],
            ]);

        $response = $this->json('POST', '/auth/login', ['email' => $user1->email, 'password'=>'invalidpassword']);
        $response
//            ->assertStatus(200)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid credentials',
            ]);
    }

    public function testGetMe()
    {
        $user1 = factory(User::class)->create();
        $token = $user1->getToken();
        $response = $this->json('GET', '/users/me', [], ['Authorization'=>'Bearer '.$token]);
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data'=>['id']])
            ->assertJson([
                'success' => true,
                'data'    => ['id'=>$user1->id],
            ]);
    }
}
