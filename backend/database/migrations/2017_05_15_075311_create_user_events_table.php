<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_events', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->integer('message_id')->unsigned()->nullable();
            $table->foreign('message_id')->references('id')->on('messages');
            $table->integer('thread_id')->unsigned()->nullable();
            $table->foreign('thread_id')->references('id')->on('threads');
            $table->integer('inbox_id')->unsigned()->nullable();
            $table->foreign('inbox_id')->references('id')->on('inboxes');
            $table->integer('target_user_id')->unsigned()->nullable();
            $table->foreign('target_user_id')->references('id')->on('users');
            $table->string('type');
            $table->text('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('user_events');
    }
}
