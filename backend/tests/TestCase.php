<?php

namespace Tests;

use App\Models\Group;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public static function makeSeededInbox($numThreads = 3, $numMessagesPerThread = 3)
    {
        $inbox = factory(Inbox::class)->create();
        for ($a = 0; $a < $numThreads; $a++) {
            $thread = factory(Thread::class)->create(['inbox_id'=>$inbox->id]);
            for ($b = 0; $b < $numMessagesPerThread; $b++) {
                factory(Message::class)->create(['thread_id'=>$thread->id]);
            }
        }

        return $inbox->load('threads.messages');
    }

    public static function connectUserToInbox($user, $inbox, $permissionLevel = Group::INBOX_PERMISSION_READWRITE)
    {
        $groupId = factory(Group::class)->create()->id;
        $inbox->groups()->attach($groupId, ['permission'=>$permissionLevel]);
        $user->groups()->attach($groupId);
    }
}
