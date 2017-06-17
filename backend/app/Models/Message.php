<?php

namespace App\Models;

use Html2Text\Html2Text;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Log;
use Mailgun\Mailgun;

class Message extends Model
{
    use SoftDeletes;
    protected $hidden = ['headers', 'raw'];

    public function thread()
    {
        return $this->belongsTo('App\Models\Thread');
    }

    public function events()
    {
        return $this->hasMany('App\Models\MessageEvent');
    }

    /**
     * @param $to - who to send the message to
     * @param $from - who to send the message from
     * @param $subject - subject
     * @param $body_html - html body
     * @param $threadId - the thread that the message should be attached to
     * @param $user_id - the User who is sending the message
     * @param null|int $replying_to_message_id
     *
     * @return Message|false
     * TODO: return false on failure, maybe error somehow cleanly
     * TODO: BCC and CC
     */
    public static function sendMessage($to, $from, $subject, $body_html, $threadId, $user_id, $replying_to_message_id = null)
    {
        $body_plain = Html2Text::convert($body_html, true);

        $m = new self();
        $m->user_id = $user_id;
        $m->thread_id = $threadId;
        $m->from = $from;
        $m->sender = $from; //sender is silly
        $m->subject = $subject;
        $m->recipient = $to;
        $m->message_id = 'pending';
        $m->body_plain = $body_plain;
        $m->body_html = $body_html;
        $m->timestamp = 0;//TODO
        if ($replying_to_message_id) {
            $m->references = $replying_to_message_id;
            $m->in_reply_to = $replying_to_message_id;
        }
        $m->save();

        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        $params = [
            'from'                 => $from,
            'to'                   => $to,
            'subject'              => $subject,
            'text'                 => $body_plain,
            'html'                 => $body_html,
            'v:antelope-message-id'=> $m->id,
        ];
        if (env('MAILGUN_TEST_MODE')) {
            $params['o:testmode'] = true;
        }
        if ($replying_to_message_id) {
            $params['In-Reply-To'] = $replying_to_message_id;
            $params['References'] = $replying_to_message_id;
        }
        $sent = $mg->messages()->send(env('MAILGUN_DOMAIN'), $params);
        $mailgunMessageId =  $sent->getId();
        $m->message_id = $mailgunMessageId;

        $m->save();
        Log::info("sent message #{$m->id}, mailgun id of {$mailgunMessageId}");

        return $m;
    }

//    public static function sendMessage($)
}
