<?php
namespace App\Http\Controllers;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use Auth;
use Mailgun\Api\Webhook;
use Mailgun\Mailgun;
use Request;
use Log;
/**
 * Class MailController.
 */
class MailController extends Controller
{
    public function test() {

        Message::newMessage(1,'nicky semenzaa <nicky@nickysemenza.com>','raw send!','boring body','<h2>mm</h2>');
//        return Message::first()->thread->inbox->primary_address;
//        return Message::with('thread.inbox')->first();

    }

    /**
     * Given a recipient address, will determine which inbox it should be routed to
     * todo: Use some sort of regex based on Inbox table columns
     * todo: will we need to strip <> data ever? probably...
     * @param $recipientAddress
     * @return integer Inbox id
     */
    public function getInboxIdForIncoming($recipientAddress) {
        //TODO
        return Inbox::first()->id;
    }

    /**
     * Mailgun sends POST to this route when a message is received.
     * @param Request $request
     * @return mixed
     */
    public function mailgunHook(Request $request) {

        //Need to verify that the POST request is authentic from Mailgun, not spoofed
        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        if(!$mg->webhooks()->verifyWebhookSignature(Request::get('timestamp'),Request::get('token'),Request::get('signature')))
            return response()->error('mailgun signature invalid');
        Log::info(Request::all());

        //Determine if we need to start a new thread, or if we add to existing thread (for reply).
        //TODO: In-Reply-To could possibly be multiple ids?
        $reference = Message::where('message_id', Request::get('In-Reply-To'))->first();
        $isAReply = ($reference==true);
        if($reference)
            $thread_id = $reference->thread_id;
        else
            $thread_id = Thread::create(['inbox_id'=>self::getInboxIdForIncoming(Request::get('recipient'))])->id;

        //Persist message to DB;
        $m = new Message();
        $m->thread_id = $thread_id;

        //summary on from vs. sender: https://cr.yp.to/immhf/sender.html
        //tl;dr: "It is unclear why Sender is supposed to be useful."
        $m->from = Request::get('from');
        $m->sender = Request::get('sender');

        $m->subject = Request::get('subject');
        $m->recipient = Request::get('recipient');//this is the address the message was sent 'to'
        $m->message_id = Request::get('Message-Id');

        $m->body_plain = Request::get('body-plain');
        $m->body_html = Request::get('body-html');
        $m->references = Request::get('References');
        $m->in_reply_to = Request::get('In-Reply-To');
        $m->headers = Request::get('message-headers');
        $m->timestamp = Request::get('timestamp');
        $m->raw = json_encode(Request::all());
        $m->save();
//        $m->reply();
        return response()->success('message saved. is-reply?:'.($isAReply ? 'y' : 'n')." thread:".$thread_id);

    }
}