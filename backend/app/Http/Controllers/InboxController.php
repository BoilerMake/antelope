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
     * Gets contents of an inbox
     * @param $inbox_id
     * @return mixed
     */
    public function getInbox($inbox_id)
    {
        //todo: check permissions, maybe via middleware?
        $user = Auth::user();
        //todo: 0 inbox
        if($inbox_id==0)
            $inbox_id=1;
        $inbox = Inbox::with('threads')->find($inbox_id);
        return response()->success($inbox);
    }

    /**
     * Gets contents of a thread
     * @param $thread_id
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
