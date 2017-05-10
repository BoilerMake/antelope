<?php

use Illuminate\Database\Seeder;

class InboxTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('inboxes')->insert([
            'name'            => 'test inbox',
            'regex'           => '',
            'primary_address' => 'test@test.com',
            'is_default'      => true,
        ]);
    }
}
