<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('thread_id')->unsigned();
            $table->foreign('thread_id')->references('id')->on('threads');
            $table->string('message_id');
            $table->string('subject');
            $table->string('recipient');
            $table->string('from');
            $table->string('sender');
            $table->string('cc')->nullable();
            $table->string('bcc')->nullable();
            $table->string('references')->nullable();
            $table->string('in_reply_to')->nullable();
            $table->text('body_plain')->nullable();
            $table->text('body_html')->nullable();
            $table->json('headers')->nullable();
            $table->text('raw')->nullable();
            $table->integer('timestamp')->nullable();
            $table->boolean('is_incoming')->default(true);
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
        Schema::drop('messages');
    }
}
