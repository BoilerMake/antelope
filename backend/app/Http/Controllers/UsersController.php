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

    public function getInboxes()
    {
        $user = Auth::user();
        $inboxes = Inbox::select('id', 'name')->findMany($user->getInboxIds());
        $totalCountNew = $inboxes->reduce(function ($carry, $item) {
            return $carry + $item->countNew;
        });

        return response()->success(array_merge(
            [['id'=>0, 'name'=>'All Inboxes', 'countNew'=>$totalCountNew]],//all user-inbox combined
            $inboxes->toArray()
        ));
    }
}
