<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Inbox;
use App\Models\User;
use App\Models\UserEvent;
use Illuminate\Validation\Rules\In;
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
            if (isset($eachInbox['id'])) {
                //the inbox exists, we are just updating the data.
                Inbox::where('id', $eachInbox['id'])->update([
                    'name'           => $eachInbox['name'],
                    'regex'          => $eachInbox['regex'],
                    'primary_address'=> $eachInbox['primary_address'],
                ]);
            } else {
                Log::info('make a new one');
                Inbox::create([
                    'name'           => $eachInbox['name'],
                    'regex'          => $eachInbox['regex'],
                    'primary_address'=> $eachInbox['primary_address'],
                ]);
            }
        }

        return self::getInboxes();
    }

    public function getUserEvents()
    {
        //todo: pagination
        return response()->success(UserEvent::with('user', 'target', 'inbox', 'message', 'thread')->get()->map(function ($item) {
            $item = $item->toArray();
            if (isset($item['thread'])) {
                unset($item['thread']['snippet']);
            }

            return $item;
        }));
    }
    public function createGroup()
    {
        return response()->success(Group::create(['name'=>Request::get('name')]));
    }
    public function getGroupInboxMatrix()
    {
        $inboxes = Inbox::all();
        $group_inbox_permissions = [];
        foreach (Group::with('inboxes')->get() as $eachGroup) {
            $groupPermissions = [];
            foreach($inboxes as $inbox) {
                $groupPermissions[$inbox->id]=$eachGroup->getPermissionsForInbox($inbox->id);
            }

            $group_inbox_permissions[$eachGroup->id] = [
                'permissions'=>$groupPermissions,
                'name'       =>$eachGroup->name
            ];
        }
        return response()->success($group_inbox_permissions);
    }
    public function putGroupInboxMatrix()
    {
        $data = json_decode(Request::getContent(), true);

        foreach ($data as $groupId => $groupData)
        {
            $group = Group::find($groupId);
            foreach($groupData['permissions'] as $inboxId => $permission) {
                if($group->getPermissionsForInbox($inboxId) != $permission) {
                    Log::info("g: {$groupId} i: {$inboxId} p: {$permission}");
                    $inbox = Inbox::find($inboxId);
                    if ($permission === "none")
                        $inbox->groups()->detach($groupId);
                    else
                        $inbox->groups()->syncWithoutDetaching([$groupId => ['permission' => $permission]]);
                }
            }
        }

        return $this->getGroupInboxMatrix();
    }
}
