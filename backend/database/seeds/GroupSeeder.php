<?php

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
        $inbox_id = DB::table('inboxes')->insertGetId([
            'name'            => 'test inbox',
            'regex'           => '',
            'primary_address' => 'test1@test.com',
            'is_default'      => true,
        ]);
        $inbox_id_2 = DB::table('inboxes')->insertGetId([
            'name'            => 'test inbox 22',
            'regex'           => '',
            'primary_address' => 'test2222@test.com',
            'is_default'      => false,
        ]);
        $inbox_id_3 = DB::table('inboxes')->insertGetId([
            'name'            => 'test inbox 33',
            'regex'           => '',
            'primary_address' => 'test33@test.com',
            'is_default'      => false,
        ]);
        $group_id_1 = DB::table('groups')->insertGetId([
            'name'            => 'test group 1 r',
        ]);
        $group_id_2 = DB::table('groups')->insertGetId([
            'name'            => 'test group 2 rw',
        ]);

        $inbox = \App\Models\Inbox::find($inbox_id);
        $inbox->groups()->attach($group_id_1,['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);
        $inbox->groups()->attach($group_id_2,['permission'=> \App\Models\Group::INBOX_PERMISSION_READWRITE]);

        $inbox2 = \App\Models\Inbox::find($inbox_id_2);
        $inbox2->groups()->attach($group_id_1,['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);
        $inbox2->groups()->attach($group_id_2,['permission'=> \App\Models\Group::INBOX_PERMISSION_READWRITE]);

        $inbox3 = \App\Models\Inbox::find($inbox_id_3);
        $inbox3->groups()->attach($group_id_1,['permission'=>\App\Models\Group::INBOX_PERMISSION_READONLY]);


        $user1 = \App\Models\User::addNew('email@aaa.com')->id;

        $user1 = \App\Models\User::find($user1);
        $user1->groups()->attach($group_id_1);
        $user1->groups()->attach($group_id_2);


    }
}
