<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Log;
use Mailgun\Mailgun;
use Request;

/**
 * Class MailController.
 */
class MailController extends Controller
{
    public function test()
    {
        $u = User::first();
        return $u->getToken();
        return Inbox::findMany($u->getInboxIds());
//        $u = User::with('groups.inboxes')->first();
//        $inboxes_by_permission = [];
//        foreach ($u->groups as $group) {
//            foreach($group->inboxes as $eachGroupInbox) {
//                $inboxes_by_permission[$eachGroupInbox->pivot->permission][]=$eachGroupInbox->id;
//            }
//        }
//        $r = $inboxes_by_permission[Group::INBOX_PERMISSION_READONLY];
//        $rw = $inboxes_by_permission[Group::INBOX_PERMISSION_READWRITE];
//
//        //we prioritize readwrite higher than readonly, so if a user has readonly AND readwrite permissions from
//        //  two different groups, then we ignore the readonly, letting the readwrite take precedence.
//        return [
//            'readOnly_ids'=> array_values(array_diff($r,$rw)),
//            'readWrite_ids'=> $rw,
//            'all_ids'=> array_unique(array_merge($r,$rw))];

//        return [
//            'readonly'=>Inbox::findMany($readOnly_ids),
//            'readwrite'=>Inbox::findMany($readWrite_ids),
//        ];
//        Message::newMessage(1, null, 'nicky semenza <nicky@nickysemenza.com>', 'TEST trackin', '<div>hello there :) <a href="nickysemenza.com">clickme</a></div>');
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
     * @param Request $request
     *
     * @return mixed
     */
    public function mailgunHook(Request $request)
    {

        //Need to verify that the POST request is authentic from Mailgun, not spoofed
        $mg = Mailgun::create(env('MAILGUN_APIKEY'));
        if (!$mg->webhooks()->verifyWebhookSignature(Request::get('timestamp'), Request::get('token'), Request::get('signature'))) {
            return response()->error('mailgun signature invalid');
        }

        //Determine if we need to start a new thread, or if we add to existing thread (for reply).
        $reference = Message::where('message_id', Request::get('In-Reply-To'))->first();
        $isAReply = ($reference == true);
        if ($reference) {
            $thread_id = $reference->thread_id;
            //it might have been set to don previously, so we need to 'reopen' if need be.
            //todo: log the state changing if it changes?
            Thread::find($thread_id)->update('state',Thread::STATE_ASSIGNED);
        } else {
            $thread_id = Thread::create([
                'inbox_id' => self::getInboxIdForIncoming(Request::get('recipient')),
                'state' => Thread::STATE_NEW
            ])->id;
        }

        //Persist message to DB;
        $m = new Message();
        $m->thread_id = $thread_id;

        //summary on from vs. sender: https://cr.yp.to/immhf/sender.html
        //tl;dr: "It is unclear why Sender is supposed to be useful."
        $m->from = Request::get('from');
        $m->sender = Request::get('sender');

        $m->subject = Request::get('subject');
        $m->recipient = Request::get('recipient'); //this is the address the message was sent 'to'
        $m->message_id = Request::get('Message-Id');

        $m->body_plain = Request::get('body-plain');
        $m->body_html = Request::get('body-html');
        $m->references = Request::get('References');
        $m->in_reply_to = Request::get('In-Reply-To');
        $m->headers = Request::get('message-headers');
        $m->timestamp = Request::get('timestamp');
        $m->raw = json_encode(Request::all());
        $m->save();
        $m->reply(null,'sup');
        //we need to return a 200 to mailgun, or else they will retry POSTing.
        return response()->success('message saved. is-reply?:'.($isAReply ? 'y' : 'n').' thread:'.$thread_id);
    }
    public function mailgunEvent(){
        Log::info('email #'.Request::get('antelope-message-id').' was:'.Request::get('event'));
        return 'ok';
    }
}
