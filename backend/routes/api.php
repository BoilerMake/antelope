<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return response()->success('hi');
});
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//auth
Route::post('auth/login', 'AuthController@login');
ROute::get('test', 'MailController@test');
Route::post('mailgunhook', 'MailController@mailgunHook');
Route::post('mailgunevent', 'MailController@mailgunEvent');

Route::group(['middleware'=>['jwt.auth'], 'prefix' => 'users/me'], function () {

    //get update me
    Route::get('/', 'UsersController@getMe');
});
