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
     * Replies to a message, basically appends this message to the target's thread.
     *
     * @param $user_id - who sent the message
     * @param $body_html - the message body
     * TODO: allow changing subject? you can only change so much to work with email threading
     * TODO: allow changing the 'from' address?
     *
     * @return Message|false
     */
    public function reply($user_id, $body_html)
    {
        $subject = (substr($this->subject, 0, 3) === 'Re:') ? $this->subject : ('Re: '.$this->subject); //i think we *need* this for gmail threading
        $from = $this->thread->inbox->primary_address;
        $to = $this->from; //replies should be sent to the from address
        $replying_to_message_id = $this->message_id;
        $threadId = $this->thread_id;

        Thread::find($this->thread_id)->update(['state'=>Thread::STATE_IN_PROGRESS]);

        return self::sendMessage($to, $from, $subject, $body_html, $threadId, $user_id, $replying_to_message_id);
    }

    /**
     * Sends a new message.
     *
     * @param $inbox_id - The Inbox to send from
     * @param $user_id - The User who is sending the message
     * @param $to - who to send the email to
     * @param $subject - email subject
     * @param $body_html - body in HTML form
     *
     * @return Message|false
     */
    public static function newMessage($inbox_id, $user_id, $to, $subject, $body_html)
    {
        $from = Inbox::find($inbox_id)->primary_address; //todo: override?
        $threadId = Thread::create(['inbox_id'=>$inbox_id, 'state'=>Thread::STATE_IN_PROGRESS])->id;
        //todo: assign this thread to a user, log thread creation
        return self::sendMessage($to, $from, $subject, $body_html, $threadId, $user_id);
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
     *                       TODO: return false on failure, maybe error somehow cleanly
     */
    private static function sendMessage($to, $from, $subject, $body_html, $threadId, $user_id, $replying_to_message_id = null)
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
        $m->timestamp = 0;
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
        $m->message_id = $sent->getId();

        $m->save();
        Log::info('sent message #'.$m->id);

        return $m;
    }

//    public static function sendMessage($)
}
