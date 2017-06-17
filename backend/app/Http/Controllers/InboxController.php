<?php

namespace App\Http\Controllers;

use App\Models\Draft;
use App\Models\Inbox;
use App\Models\Message;
use App\Models\Thread;
use App\Models\UserEvent;
use Auth;
use Log;
use Request;

/**
 * Class InboxController.
 * Handles routes that power the main inbox view.
 */
class InboxController extends Controller
{
    /**
     * Gets contents of an inbox.
     * PERMISSIONS: you can only get an inbox if you have read or readwrite permissions.
     *
     * @param $inbox_id
     *
     * @return mixed
     */
    public function getInbox($inbox_id)
    {
        //todo: proper sorting
        //todo: pagination
        $user = Auth::user();
        $user_inbox_ids = $user->getInboxIds();
        if ($inbox_id == 0) {
            //we want to combine all the user's Inbox to act as the fake 0 inbox
            $threads = Thread::getSorted($user_inbox_ids);
            $inboxName = 'All Inboxes';
            //get the counts for each inbox
            //todo: this is kinda slow i think, maybe if we lightly cache this?
            $allCounts = Inbox::find($user_inbox_ids)->map(function ($item) {
                return $item->counts();
            });
            //now sum up all the counts
            $counts = [];
            foreach ($allCounts as $item) {
                foreach ($item as $k => $v) {
                    if (array_key_exists($k, $counts)) {
                        $counts[$k] += $v;
                    } else {
                        $counts[$k] = $v;
                    }
                }
            }
        } else {
            if (!in_array($inbox_id, $user_inbox_ids)) {
                return response()->error('You do not have permission to access this inbox.', null, 403);
            }
            $inbox = Inbox::find($inbox_id);
            $inboxName = Inbox::find($inbox_id)->name;
            $threads = Thread::getSorted([$inbox_id]);
            $counts = $inbox->counts();
        }

        return response()->success([
            'id'     => $inbox_id,
            'name'   => $inboxName,
            'threads'=> $threads,
            'counts' => $counts,
        ]);
    }

    /**
     * Used to chronologically sort the UserEvent and Messages objects so that they can be shown inline.
     * @param $a
     * @param $b
     * @return int
     */
    private static function  cmp($a, $b) {
        if ($a['content']['created_at'] == $b['content']['created_at']) {
            return 0;
        }
        return ($a['content']['created_at'] < $b['content']['created_at']) ? -1 : 1;
    }

    /**
     * Gets contents of a thread.
     * PERMISSIONS: you can only get a thread if you have read or readwrite permissions for its inbox.
     *
     * @param $thread_id
     *
     * @return mixed
     */
    public function getThread($thread_id)
    {
        //todo: check permissions, maybe via middleware?
        $user = Auth::user();
        $thread = Thread::with(
            'messages.events',
            'users',
            'userEvents.user',
            'userEvents.target',
            'drafts.user')->find($thread_id);
        if (!in_array($thread->inbox_id, $user->getInboxIds())) {
            return response()->error('You do not have permission to access this thread.', null, 403);
        }
        $thread->readOnly = !in_array($thread->inbox_id, $user->getReadWriteInboxIds());

        $combo = [];
        foreach ($thread->userEvents as $userEvent)
            $combo[]=['type'=>'user_event','content'=>$userEvent];
        foreach ($thread->messages as $message)
            $combo[]=['type'=>'message','content'=>$message];

        usort($combo,"self::cmp");
        $thread->combo = $combo;
        $thread = $thread->toArray();
//        unset($thread['messages']);
        unset($thread['userEvents']);
        return response()->success($thread);
    }

    /**
     * Gets all the assigned users, as well as users who can potentially be assigned, for a thread.
     * PERMISSIONS: you can only get assignments for a thread if you have read or readwrite permissions for its inbox.
     *
     * @param $thread_id
     *
     * @return mixed
     */
    public function getAssignments($thread_id)
    {
        $user = Auth::user();
        $thread = Thread::find($thread_id);
        if (!in_array($thread->inbox_id, $user->getInboxIds())) {
            return response()->error('You do not have permission to access this thread or its assignments.', null, 403);
        }

        return response()->success($thread->getAssignedUsers());
    }

    /**
     * Updates the assignments, using the same data structure as getAssignments.
     * PERMISSIONS: you can only put assignments for a thread if you have readwrite permissions for its inbox.
     *
     * @param $thread_id
     *
     * @return mixed
     */
    public function putAssignments($thread_id)
    {
        $user = Auth::user();
        $thread = Thread::find($thread_id);
        if (!in_array($thread->inbox_id, $user->getReadWriteInboxIds())) {
            return response()->error('You do not have permission to access this thread or its assignments.', null, 403);
        }
        $data = json_decode(Request::getContent(), true);
        foreach ($thread->getAssignedUsers() as $k => $assignedUser) {
            $currentState = $assignedUser['assigned_to_thread'];
            $newState = $data[$k]['assigned_to_thread'];
            if (!$currentState && $newState) {
                $thread->users()->attach($k);
                $user->recordThreadEvent($thread, UserEvent::TYPE_ASSIGN_THREAD, $k);
                if ($thread->state === Thread::STATE_NEW) {
                    $thread->state = Thread::STATE_ASSIGNED;
                    $thread->save();
                }
            } elseif ($currentState && !$newState) {
                $thread->users()->detach($k);
                $user->recordThreadEvent($thread, UserEvent::TYPE_UNASSIGN_THREAD, $k);
            }
        }

        return response()->success($data);
    }

    /**
     * Create a draft tied to a thread
     * PERMISSIONS: you can only create a draft in a thread if you have readwrite permissions to that thread's inbox.
     * TODO: support reply all, etc.
     * TODO: allow changing subject? you can only change so much to work with email threading
     * TODO: allow changing the 'from' address?- this breaks threading if it's not the same address as the initial mail was sent to
     *
     * @param $thread_id
     * @param string $mode
     *
     * @return mixed
     */
    public function createDraft($thread_id, $mode = 'reply')
    {
        $thread = Thread::with('inbox')->find($thread_id);
        $user = Auth::user();
        if (!in_array($thread->inbox_id, $user->getReadWriteInboxIds())) {
            return response()->error('You do not have permission to create a draft in this inbox', null, 403);
        }
        //creating a draft will auto assign you to the thread
        $thread->assignUser($user);




        $signature = $user->signature;
        $draft = Draft::create([
            'user_id'  => $user->id,
            'thread_id'=> $thread_id,
            'body'     => '<br/><br/>'.$signature,//Drafts just start as your signature.
            'from'     => $thread->inbox->primary_address,
        ]);


        $lastIncomingMessage = $thread->getLastMessage(true);
        if($lastIncomingMessage) {
            $draft->reply_to_message_id = $lastIncomingMessage->id;
            //replies should be sent to the from address
            $draft->to = $lastIncomingMessage->from;
            $draft->subject = (substr($lastIncomingMessage->subject, 0, 3) === 'Re:')
                ? $lastIncomingMessage->subject
                : ('Re: '.$lastIncomingMessage->subject); //i think we *need* this for gmail threading
            $draft->save();
            Log::info("Creating draft # {$draft->id} - it is a reply to message {$lastIncomingMessage->id} in thread {$thread_id}");
        }
        else {
            //there are no messages in the thread.
            Log::info("Creating draft # {$draft->id} - it is the first message in thread {$thread_id}");
        }

        $user->recordThreadEvent($thread, UserEvent::TYPE_CREATE_DRAFT);

        return response()->success($draft);
    }

    /**
     * Updates the Draft.
     * action parameter can specify save|send|delete
     * PERMISSIONS: you can only update a draft if you are it's creator.
     * TODO: support deletion.
     *
     * @param $draft_id
     *
     * @return mixed
     */
    public function updateDraft($draft_id)
    {
        $draft = Draft::with('thread')->find($draft_id);
        $user = Auth::user();
        if ($user->id !== $draft->user_id) {
            return response()->error('You can only update your own draft.', null, 403);
        }
        $data = json_decode(Request::getContent(), true);
        $draft->body = $data['body'];
        $draft->save();

        $action = Request::get('action');
        if ($action === 'send') {
            $user->recordThreadEvent($draft->thread, UserEvent::TYPE_SEND_DRAFT);
            $draft->send();
            $draft->delete();//delete the draft because we sent it
        }

        return response()->success($draft);
    }
}
