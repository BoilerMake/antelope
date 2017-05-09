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
        //things:
        //replies should be sent to the from address
        $subject = 're: '.$this->subject;
        $from = $this->thread->inbox->primary_address;//todo: maybe allow overriding this?
        $to = $this->from;//eep

        $replying_to_message_id = $this->message_id;
        $body_plain = 'omg reply?';
        $body_html = '<h1>test</h1>';

        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        $sent = $mg->messages()->send(env('MAILGUN_DOMAIN'), [
            'from'    => $from,
            'to'      => $to,
            'subject' => $subject,
            'In-Reply-To' => $replying_to_message_id,
            'References' => $replying_to_message_id,
            'text'    => $body_plain,
            'html'    => $body_html
        ]);

        $m = new Message();
        $m->thread_id = $this->thread_id;
        $m->from = $from;
        $m->sender = $from;//??
        $m->subject = $subject;
        $m->recipient = $to;//??
        $m->message_id = $sent->getId();
        $m->body_plain = $body_plain;
        $m->body_html =  $body_html;
        $m->references = $replying_to_message_id;
        $m->in_reply_to = $replying_to_message_id;
        $m->save();
    }
//    public static function sendMessage($)
}
