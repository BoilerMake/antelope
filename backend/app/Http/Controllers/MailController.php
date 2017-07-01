<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\Message;
use App\Models\MessageEvent;
use App\Models\Thread;
use Log;
use Mailgun\Mailgun;
use Request;

/**
 * Class MailController.
 */
class MailController extends Controller
{
    const ERR_MAILGUN_SIGNATURE_INVALID = 'mailgun signature invalid';
    const ERR_MAILGUN_REF_DNE = 'mailgun reference thread does not exist';

    /**
     * Given a recipient address, will determine which inbox it should be routed to.
     *
     * @param $recipient
     *
     * @return Inbox
     */
    public static function getInboxForIncoming($recipient)
    {
        $recipientAddress = self::extractAddress($recipient);
        foreach (Inbox::all() as $eachInbox) {
            $noWhite = str_replace(' ', '', $eachInbox->regex);
            //strip whitespace, then explode
            foreach (explode(',', $noWhite) as $eachAddress) {
                if ($recipientAddress === $eachAddress) {
                    return $eachInbox;
                }
            }
        }
        //if no match, fall back to default
        return Inbox::where('is_default', true)->first();
    }

    /**
     * Given a full email, like: bob john <bob@gmail.com>, extract the raw address.
     *
     * @param $text
     *
     * @return null|string
     */
    public static function extractAddress($text)
    {
        preg_match_all('/\b[^\s]+@[^\s|^>]+/', $text, $matches);
        $match = $matches[0];

        return count($match) == 0 ? null : $match[0];
    }

    /**
     * Mailgun sends POST to this route when a message is received.
     * If it is a reply, we need to add it to the appropriate thread
     * If it is a new email, we need to determine which inbox to route it to, and add it to a new thread in that inbox.
     *
     * @return mixed
     */
    public function mailgunHook()
    {
        if (!$this->isMailgunSignatureValid()) {
            return response()->error(self::ERR_MAILGUN_SIGNATURE_INVALID);
        }

        //Determine if we need to start a new thread, or if we add to existing thread (for reply).
        $reference = Message::where('message_id', Request::get('In-Reply-To'))->first();
        $isAReply = ($reference == true);
        if ($reference) {
            $thread_id = $reference->thread_id;
            //it might have been set to don previously, so we need to 'reopen' if need be.
            //todo: log the state changing if it changes?
            Thread::find($thread_id)->update(['state', Thread::STATE_ASSIGNED]);
            Log::info("mailgun message incoming, is a reply to thread {$thread_id}");
        } else {
            $targetInboxId = self::getInboxForIncoming(Request::get('recipient'))->id;
            $thread_id = Thread::create([
                'inbox_id' => $targetInboxId,
                'state'    => Thread::STATE_NEW,
            ])->id;
            Log::info("mailgun message incoming, routing to new thread ({$thread_id})in inbox {$targetInboxId}");
        }

        //Persist message to DB;
        $m = new Message();
        $m->thread_id = $thread_id;

        //summary on from vs. sender: https://cr.yp.to/immhf/sender.html
        //tl;dr: "It is unclear why Sender is supposed to be useful."
        $m->from = Request::get('From');
        $m->sender = Request::get('sender');

        $m->recipient = Request::get('recipient'); //this is the address the message was sent 'to'
        $m->to = Request::get('To');

        $m->cc = Request::get('Cc');
        $m->bcc = Request::get('Bcc');

        $m->subject = Request::get('subject');
        $m->message_id = Request::get('Message-Id');

        $m->body_plain = Request::get('body-plain');
        $m->body_html = Request::get('body-html');
        $m->references = Request::get('References');
        $m->in_reply_to = Request::get('In-Reply-To');
        $m->headers = Request::get('message-headers');
        $m->timestamp = Request::get('timestamp');
        $m->raw = json_encode(Request::all());
        $m->save();
        //we need to return a 200 to mailgun, or else they will retry POSTing.
        return response()->success('message saved. is-reply?:'.($isAReply ? 'y' : 'n').' thread:'.$thread_id);
    }

    /**
     * Receives mailgun events such as click, open, etc.
     *
     * @return string
     */
    public function mailgunEvent()
    {
        if (!$this->isMailgunSignatureValid()) {
            return response()->error(self::ERR_MAILGUN_SIGNATURE_INVALID);
        }

        $message_id = Request::get('antelope-message-id');
        if (!$message_id || !Message::find($message_id)) {
            return response()->error(self::ERR_MAILGUN_REF_DNE, null, 200);
        }
        Log::info('email #'.$message_id.' was:'.Request::get('event'));
        MessageEvent::create([
            'message_id' => $message_id,
            'name'       => Request::get('event'),
            'timestamp'  => Request::get('timestamp'),
            'recipient'  => Request::get('recipient'),
            'raw'        => json_encode(Request::all()),
        ]);

        return response()->success('ok');
    }

    /**
     * Need to verify that the POST request is authentic from Mailgun, not spoofed.
     *
     * @return bool is valid
     */
    private function isMailgunSignatureValid()
    {
        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        if (!$mg->webhooks()->verifyWebhookSignature(Request::get('timestamp'), Request::get('token'), Request::get('signature'))) {
            if (!env('MAILGUN_IGNORE_SIGNATURE')) {//so we can override signature validation for testing
                return false;
            }
        }

        return true;
    }
}
