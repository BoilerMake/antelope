<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\Thread;
use Auth;

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
        $thread = Thread::with('messages')->find($thread_id);

        return response()->success($thread);
    }
}
