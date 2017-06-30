<?php

namespace Tests\Unit;

use App\Http\Controllers\MailController;
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
        $this->assertTrue(true);
    }
    public function testExtractEmail() {
        $this->assertEquals(MailController::extractAddress("test@domain.com"),"test@domain.com");
        $this->assertEquals(MailController::extractAddress("asdfasdf"),null);
        $this->assertEquals(MailController::extractAddress(""),null);
        $this->assertEquals(MailController::extractAddress(null),null);
        $this->assertEquals(MailController::extractAddress("bob john <hi@asdf.com>"),"hi@asdf.com");
        $this->assertEquals(MailController::extractAddress("bob john <hi@asdf.com>, another person <hi@hi.com"),"hi@asdf.com");
    }
}
