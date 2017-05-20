<?php

namespace App\Http\Controllers;

use App\Models\Draft;
use App\Models\Inbox;
use App\Models\Thread;
use App\Models\UserEvent;
use Auth;
use Log;
use Request;

/**
 * Class UsersController.
 */
class InboxController extends Controller
{
    /**
     * Gets contents of an inbox.
     *
     * @param $inbox_id
     *
     * @return mixed
     */
    public function getInbox($inbox_id)
    {
        //todo: proper sorting
        //todo: check permissions, maybe via middleware?
        $user = Auth::user();
        if ($inbox_id == 0) {
            //we want to combine all the user's Inbox to act as the fake 0 inbox
            $threads = Thread::getSorted($user->getInboxIds());
            $inboxName = 'All Inboxes';
        } else {
            $inboxName = Inbox::find($inbox_id)->name;
            $threads = Thread::getSorted([$inbox_id]);
        }

        return response()->success([
            'id'     => $inbox_id,
            'name'   => $inboxName,
            'threads'=> $threads,
        ]);
    }

    /**
     * Gets contents of a thread.
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
            'drafts')->find($thread_id);

        return response()->success($thread);
    }

    public function getAssignments($thread_id)
    {
        return response()->success(Thread::find($thread_id)->getAssignedUsers());
    }

    public function putAssignments($thread_id)
    {
        $user = Auth::user();
        $thread = Thread::find($thread_id);
        $data = json_decode(Request::getContent(), true);
        foreach ($thread->getAssignedUsers() as $k => $assignedUser) {
            $currentState = $assignedUser['assigned_to_thread'];
            $newState = $data[$k]['assigned_to_thread'];
            if (!$currentState && $newState) {
                Log::info('assign '.$k);
                $thread->users()->attach($k);
                $user->recordThreadEvent($thread, UserEvent::TYPE_ASSIGN_THREAD, $k);
                if($thread->state === Thread::STATE_NEW) {
                    $thread->state = Thread::STATE_ASSIGNED;
                    $thread->save();
                }
            } elseif ($currentState && !$newState) {
                Log::info('unassign '.$k);
                $thread->users()->detach($k);
                $user->recordThreadEvent($thread, UserEvent::TYPE_UNASSIGN_THREAD, $k);
            }
        }

        return response()->success($data);
    }

    public function createDraft($thread_id, $mode = 'reply')
    {
        $thread = Thread::find($thread_id);
        $user = Auth::user();
        $signature = "user #{$user->id} signature"; //todo
        $d = Draft::create([
            'user_id'  => $user->id,
            'thread_id'=> $thread_id,
            'body'     => '<br/><br/>'.$signature,
        ]);
        $user->recordThreadEvent($thread, UserEvent::TYPE_CREATE_DRAFT);

        return response()->success($d);
    }

    public function updateDraft($draft_id)
    {
        $user = Auth::user();
        $draft = Draft::with('thread')->find($draft_id); //todo: fancy model hinting
        $data = json_decode(Request::getContent(), true);
        $draft->body = $data['body'];
        $draft->save();
        $action = Request::get('action');
        if($action==="send") {
            $user->recordThreadEvent($draft->thread, UserEvent::TYPE_SEND_DRAFT);
            $message = $draft->thread->getLastMessage();
            $message->reply($draft->user_id,$draft->body);

        }

        return response()->success($draft);
    }
}
