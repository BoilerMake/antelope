<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class UsersController.
 */
class UsersController extends Controller
{
    /**
     * Gets the currently logged in User.
     *
     * @return User|null
     */
    public function getMe()
    {
        //        return JWTAuth::parseToken()->authenticate();
        return response()->success(Auth::user());
    }
    public function getInboxes() {
        $user = Auth::user();
        $combinedInbox = [['id'=>0,'name'=>'All Inboxes']];//fake entry to show all inboxes
        $inboxes = Inbox::select('id','name')->findMany($user->getInboxIds())->toArray();
        return response()->success(array_merge($combinedInbox,$inboxes));
    }
}
