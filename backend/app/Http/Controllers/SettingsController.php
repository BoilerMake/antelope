<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\UserEvent;
use Log;
use Request;

/**
 * Class UsersController.
 */
class SettingsController extends Controller
{
    public function getInboxes()
    {
        return response()->success(Inbox::with('groups')->get());
    }
    public function putInboxes()
    {
        $data = json_decode(Request::getContent(), true);
        foreach ($data as $eachInbox) {
            if(isset($eachInbox['id'])) {
                //the inbox exists, we are just updating the data.
                Inbox::where('id',$eachInbox['id'])->update([
                    'name'=>$eachInbox['name'],
                    'regex'=>$eachInbox['regex'],
                    'primary_address'=>$eachInbox['primary_address']
                ]);
            }
            else {
                Log::info('make a new one');
                Inbox::create([
                    'name'=>$eachInbox['name'],
                    'regex'=>$eachInbox['regex'],
                    'primary_address'=>$eachInbox['primary_address']
                ]);
            }
        }
        return self::getInboxes();
    }
    public function getUserEvents()
    {
        //todo: pagination
        return response()->success(UserEvent::with('user','target','inbox','message','thread')->get()->map(function ($item) {
            $item = $item->toArray();
            if(isset($item['thread'])) unset($item['thread']['snippet']);
            return $item;
        }));
    }
}
