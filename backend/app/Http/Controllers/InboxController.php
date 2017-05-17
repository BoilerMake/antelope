<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\Thread;
use App\Models\User;
use App\Models\UserEvent;
use Auth;
use function GuzzleHttp\Psr7\str;
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
        $thread = Thread::with('messages.events','users','userEvents.user','userEvents.target')->find($thread_id);

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
        $data = json_decode(Request::getContent(),true);
        foreach ($thread->getAssignedUsers() as $k => $assignedUser) {
            $currentState = $assignedUser['assigned_to_thread'];
            $newState = $data[$k]['assigned_to_thread'];
            if(!$currentState && $newState) {
                Log::info('assign '.$k);
                $thread->users()->attach($k);
                $user->recordThreadEvent($thread,UserEvent::TYPE_ASSIGN_THREAD,$k);
            }
            else if($currentState && !$newState) {
                Log::info('unassign '.$k);
                $thread->users()->detach($k);
                $user->recordThreadEvent($thread,UserEvent::TYPE_UNASSIGN_THREAD,$k);
            }
        }

        return response()->success($data);
    }
}
