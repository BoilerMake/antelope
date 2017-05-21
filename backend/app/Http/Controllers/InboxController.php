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
 * Class InboxController.
 * Handles routes that power the main inbox view.
 */
class InboxController extends Controller
{
    /**
     * Gets contents of an inbox.
     * PERMISSIONS: you can only get an inbox if you have read or readwrite permissions
     * @param $inbox_id
     *
     * @return mixed
     */
    public function getInbox($inbox_id)
    {
        //todo: proper sorting
        //todo: check permissions, maybe via middleware?
        $user = Auth::user();
        $user_inbox_ids = $user->getInboxIds();
        if ($inbox_id == 0) {
            //we want to combine all the user's Inbox to act as the fake 0 inbox
            $threads = Thread::getSorted($user_inbox_ids);
            $inboxName = 'All Inboxes';
        } else {
            if(!in_array($inbox_id,$user_inbox_ids))
                return response()->error("You do not have permission to access this inbox.",null,403);
            Log::info('good to go'.$inbox_id);
            Log::info($user->id,$user_inbox_ids);
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
     * PERMISSIONS: you can only get a thread if you have read or readwrite permissions for its inbox
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
        if(!in_array($thread->inbox_id,$user->getInboxIds()))
            return response()->error("You do not have permission to access this thread.",null,403);
        return response()->success($thread);
    }

    /**
     * Gets all the assigned users, as well as users who can potentially be assigned, for a thread.
     * PERMISSIONS: you can only get assignments for a thread if you have read or readwrite permissions for its inbox.
     * @param $thread_id
     * @return mixed
     */
    public function getAssignments($thread_id)
    {
        $user = Auth::user();
        $thread = Thread::find($thread_id);
        if(!in_array($thread->inbox_id,$user->getInboxIds()))
            return response()->error("You do not have permission to access this thread or its assignments.",null,403);
        return response()->success($thread->getAssignedUsers());
    }

    /**
     * Updates the assignments, using the same data structure as getAssignments.
     * PERMISSIONS: you can only put assignments for a thread if you have readwrite permissions for its inbox.
     * @param $thread_id
     * @return mixed
     */
    public function putAssignments($thread_id)
    {
        $user = Auth::user();
        $thread = Thread::find($thread_id);
        if(!in_array($thread->inbox_id,$user->getReadWriteInboxIds()))
            return response()->error("You do not have permission to access this thread or its assignments.",null,403);
        $data = json_decode(Request::getContent(), true);
        foreach ($thread->getAssignedUsers() as $k => $assignedUser) {
            $currentState = $assignedUser['assigned_to_thread'];
            $newState = $data[$k]['assigned_to_thread'];
            if (!$currentState && $newState) {
                $thread->users()->attach($k);
                $user->recordThreadEvent($thread, UserEvent::TYPE_ASSIGN_THREAD, $k);
                if($thread->state === Thread::STATE_NEW) {
                    $thread->state = Thread::STATE_ASSIGNED;
                    $thread->save();
                }
            } elseif ($currentState && !$newState) {
                $thread->users()->detach($k);
                $user->recordThreadEvent($thread, UserEvent::TYPE_UNASSIGN_THREAD, $k);
            }
        }

        return response()->success($data);
    }

    /**
     * Create a draft tied to a thread
     * PERMISSIONS: you can only create a draft in a thread if you have readwrite permissions to that thread's inbox.
     * TODO: support reply all, etc
     * @param $thread_id
     * @param string $mode
     * @return mixed
     */
    public function createDraft($thread_id, $mode = 'reply')
    {
        $thread = Thread::find($thread_id);
        $user = Auth::user();
        if(!in_array($thread->inbox_id,$user->getReadWriteInboxIds()))
            return response()->error("You do not have permission to create a draft in this inbox",null,403);
        //creating a draft will auto assign you to the thread
        $thread->users()->attach($user->id);
        $user->recordThreadEvent($thread, UserEvent::TYPE_ASSIGN_THREAD, $user->id);

        //Drafts just start as your signature.
        $signature = "user #{$user->id} signature"; //todo
        $d = Draft::create([
            'user_id'  => $user->id,
            'thread_id'=> $thread_id,
            'body'     => '<br/><br/>'.$signature,
        ]);
        $user->recordThreadEvent($thread, UserEvent::TYPE_CREATE_DRAFT);

        return response()->success($d);
    }

    /**
     * Updates the Draft.
     * action parameter can specify save|send|delete
     * PERMISSIONS: you can only update a draft if you are it's creator.
     * TODO: support deletion
     * @param $draft_id
     * @return mixed
     */
    public function updateDraft($draft_id)
    {
        $draft = Draft::with('thread')->find($draft_id); //todo: fancy model hinting
        $user = Auth::user();
        if($user->id !== $draft->user_id)
            return response()->error("You can only update your own draft.",null,403);
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
