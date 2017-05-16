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

Route::group(['middleware'=>['jwt.auth']], function () {
    Route::get('inbox/{id}', 'InboxController@getInbox');
    Route::get('thread/{id}', 'InboxController@getThread');
    Route::get('thread/{id}/assignments', 'InboxController@getAssignments');
    Route::put('thread/{id}/assignments', 'InboxController@putAssignments');
});

Route::group(['middleware'=>['jwt.auth'], 'prefix' => 'users/me'], function () {

    //get update me
    Route::get('/', 'UsersController@getMe');
    Route::get('inboxes', 'UsersController@getInboxes');
});
