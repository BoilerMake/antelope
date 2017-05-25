<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\User;
use Auth;
use Request;

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
        return response()->success(Auth::user());
    }
    public function updateMe()
    {
        $user = Auth::user();
        $data = json_decode(Request::getContent(), true);
        foreach($data as $k => $v) {
            if(in_array($k,['first_name','last_name','email','signature']))
                $user->$k = $v;
        }
        $user->save();
        return response()->success('ok');
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
