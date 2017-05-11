<?php

namespace Tests\Unit;

use App\Models\Inbox;
use App\Models\Group;
use App\Models\User;
use Tests\TestCase;

class UserGroupInboxPermissionsTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserGroupPermissions()
    {
        $inbox_1 = factory(Inbox::class)->create();
        $inbox_2 = factory(Inbox::class)->create();
        $inbox_3 = factory(Inbox::class)->create();

        $group_id_1 = factory(Group::class)->create()->id;
        $group_id_2 = factory(Group::class)->create()->id;

        $inbox_1->groups()->attach($group_id_1,['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);
        $inbox_1->groups()->attach($group_id_2,['permission'=> \App\Models\Group::INBOX_PERMISSION_READWRITE]);

        $inbox_2->groups()->attach($group_id_1,['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);
        $inbox_2->groups()->attach($group_id_2,['permission'=> \App\Models\Group::INBOX_PERMISSION_READWRITE]);

        $inbox_3->groups()->attach($group_id_1,['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);


        $user1 = factory(User::class)->create();
        $user1->groups()->attach($group_id_1);
        $user1->groups()->attach($group_id_2);

        $this->assertEquals(Group::find($group_id_1)->users[0]->id,$user1->id);

        $this->assertEquals(array_diff($user1->getInboxIds(),[$inbox_1->id,$inbox_2->id,$inbox_3->id]),[]);
    }
}
