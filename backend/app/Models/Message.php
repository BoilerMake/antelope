<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Mailgun\Mailgun;

class Message extends Model
{
    public function thread()
    {
        return $this->belongsTo('App\Models\Thread');
    }

    public function reply()
    {
        $subject = 're: '.$this->subject; //todo: support overriding this
        $from = $this->thread->inbox->primary_address; //todo: maybe allow overriding this?
        $to = $this->from; //replies should be sent to the from address

        $replying_to_message_id = $this->message_id;
        $body_plain = 'omg reply?';
        $body_html = '<h1>test</h1>';

        $threadId = $this->thread_id;

        self::sendMessage($to, $from, $subject, $body_plain, $body_html, $threadId, $replying_to_message_id);
    }

    public static function newMessage($inbox_id, $to, $subject, $body_plain, $body_html)
    {
        $from = Inbox::find($inbox_id)->primary_address; //todo: override?
        $threadId = Thread::create(['inbox_id'=>$inbox_id])->id;
        self::sendMessage($to, $from, $subject, $body_plain, $body_html, $threadId);
    }

    private static function sendMessage($to, $from, $subject, $body_plain, $body_html, $threadId, $replying_to_message_id = null)
    {
        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        $params = [
            'from'    => $from,
            'to'      => $to,
            'subject' => $subject,
            'text'    => $body_plain,
            'html'    => $body_html,
        ];
        if ($replying_to_message_id) {
            $params['In-Reply-To'] = $replying_to_message_id;
            $params['References'] = $replying_to_message_id;
        }
        $sent = $mg->messages()->send(env('MAILGUN_DOMAIN'), $params);

        $m = new self();
        $m->thread_id = $threadId;
        $m->from = $from;
        $m->sender = $from; //sender is silly
        $m->subject = $subject;
        $m->recipient = $to;
        $m->message_id = $sent->getId();
        $m->body_plain = $body_plain;
        $m->body_html = $body_html;
        $m->timestamp = 0;
        if ($replying_to_message_id) {
            $m->references = $replying_to_message_id;
            $m->in_reply_to = $replying_to_message_id;
        }
        $m->save();
    }

//    public static function sendMessage($)
}
