<?php
namespace App\Http\Controllers;
use Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class UsersController.
 */
class UsersController extends Controller
{
    /**
     * Gets the currently logged in User.
     * @return User|null
     */
    public function getMe()
    {
//        return JWTAuth::parseToken()->authenticate();
        return response()->success(Auth::user());
    }
}