<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class UsersController.
 */
class SettingsController extends Controller
{
    public function getInboxes()
    {
        return response()->success(Inbox::with('groups')->limit(15)->get());
    }
}
