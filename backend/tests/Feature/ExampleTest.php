<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
//        putenv("MAILGUN_IGNORE_SIGNATURE=true");
//        self::assertEquals(env("A"),"B");
    }
}
