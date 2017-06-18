<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Draft extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function thread()
    {
        return $this->belongsTo('App\Models\Thread');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Sends a draft.
     * TODO: cc and bcc.
     */
    public function send()
    {
        $to = $this->to;
        $from = $this->from;
        $cc = $this->cc;
        $bcc = $this->bcc;
        $subject = $this->subject;
        $body_html = $this->body;
        $threadId = $this->thread_id;
        $userId = $this->user_id;
        $replying_to_message_id = $this->reply_to_message_id;

        Message::sendMessage($to, $from, $subject, $body_html, $threadId, $userId, $replying_to_message_id);
        Thread::find($this->thread_id)->update(['state'=>Thread::STATE_IN_PROGRESS]);
    }
}
