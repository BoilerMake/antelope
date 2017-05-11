<?php

use App\Models\Group;
use App\Models\Inbox;
use App\Models\User;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $inbox_1 = factory(Inbox::class)->create();
        $inbox_2 = factory(Inbox::class)->create();
        $inbox_3 = factory(Inbox::class)->create();

        $group_id_1 = factory(Group::class)->create()->id;
        $group_id_2 = factory(Group::class)->create()->id;

        $inbox_1->groups()->attach($group_id_1, ['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);
        $inbox_1->groups()->attach($group_id_2, ['permission'=> \App\Models\Group::INBOX_PERMISSION_READWRITE]);

        $inbox_2->groups()->attach($group_id_1, ['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);
        $inbox_2->groups()->attach($group_id_2, ['permission'=> \App\Models\Group::INBOX_PERMISSION_READWRITE]);

        $inbox_3->groups()->attach($group_id_1, ['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);

        $user1 = factory(User::class)->create();
        $user1->groups()->attach($group_id_1);
        $user1->groups()->attach($group_id_2);
    }
}
