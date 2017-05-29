<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Hash;
use Illuminate\Http\Request;
use Validator;

/**
 * Class AuthController.
 */
class AuthController extends Controller
{
    /**
     * @param Request $request: email, password
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $validator = Validator::make($credentials, [
            'email'      => 'required|email',
            'password'   => 'required',
        ]);
        if ($validator->fails()) {
            return response()->error($validator->errors()->all());
        } else {
            if (Auth::attempt(['email' => $request['email'], 'password' => $request['password']])) {
                $token = Auth::user()->getToken();

                return response()->success(compact('token'));
            }
        }

        return response()->error('Invalid credentials');
    }
    public function onboard(Request $request)
    {
        $credentials = $request->only('password','first_name','last_name');
        $validator = Validator::make($credentials, [
            'password'   => 'required|min:6',
            'last_name'   => 'required|min:1',
            'first_name'   => 'required|min:1',
        ]);
        if ($validator->fails())
            return response()->error($validator->errors()->all());
        $user = User::where('confirmation_code',$request->get('confirmation_code'))->first();
        if(!$user)
            return response()->error("Invalid Confirmation Code.");
        if($user->confirmed)
            return response()->error("You've already signed up!");
        $user->password = Hash::make($request['password']);
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->confirmed = true;
        $user->save();
        $token = $user->getToken();
        return response()->success(compact('token'));
    }
}
