<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use Auth;

/**
 * Class UsersController.
 */
class InboxController extends Controller
{

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
}
