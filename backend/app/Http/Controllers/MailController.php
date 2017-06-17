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
    public function test() {
        $thread = Thread::find(38);
        return $thread->getAssignedUsers();
    }
    /**
     * Given a recipient address, will determine which inbox it should be routed to
     * todo: Use some sort of regex based on Inbox table columns
     * todo: will we need to strip <> data ever? probably...
     *
     * @param $recipientAddress
     *
     * @return int Inbox id
     */
    public function getInboxIdForIncoming($recipientAddress)
    {
        //TODO
        return Inbox::first()->id;
    }

    /**
     * Mailgun sends POST to this route when a message is received.
     * If it is a reply, we need to add it to the appropriate thread
     * If it is a new email, we need to determine which inbox to route it to, and add it to a new thread in that inbox.
     *
     * @param Request $request
     *
     * @return mixed
     */
    public function mailgunHook(Request $request)
    {

        //Need to verify that the POST request is authentic from Mailgun, not spoofed
        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        if (!$mg->webhooks()->verifyWebhookSignature(Request::get('timestamp'), Request::get('token'), Request::get('signature'))) {
            if (!env('MAILGUN_IGNORE_SIGNATURE')) {//so we can override signature validation for testing
                return response()->error('mailgun signature invalid');
            }
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
            $targetInboxId = self::getInboxIdForIncoming(Request::get('recipient'));
            $thread_id = Thread::create([
                'inbox_id' => $targetInboxId,
                'state'    => Thread::STATE_NEW,
            ])->id;
            Log::info("mailgun message incoming, routing to new thread in inbox {$targetInboxId}");
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
//        $m->reply(null,'sup');
        //we need to return a 200 to mailgun, or else they will retry POSTing.
        return response()->success('message saved. is-reply?:'.($isAReply ? 'y' : 'n').' thread:'.$thread_id);
    }

    /**
     * Receives mailgun events such as click, open, etc.
     * TODO: implement.
     *
     * @return string
     */
    public function mailgunEvent()
    {
        //Need to verify that the POST request is authentic from Mailgun, not spoofed
        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        if (!$mg->webhooks()->verifyWebhookSignature(Request::get('timestamp'), Request::get('token'), Request::get('signature'))) {
            if (!env('MAILGUN_IGNORE_SIGNATURE')) {//so we can override signature validation for testing
                return response()->error('mailgun signature invalid');
            }
        }

        Log::info('email #'.Request::get('antelope-message-id').' was:'.Request::get('event'));
        MessageEvent::create([
            'message_id' => Request::get('antelope-message-id'),
            'name'       => Request::get('event'),
            'timestamp'  => Request::get('timestamp'),
            'recipient'  => Request::get('recipient'),
            'raw'        => json_encode(Request::all()),
        ]);

        return response()->success('ok');
    }
}
