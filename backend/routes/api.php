<?php

use Illuminate\Http\Request;

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

    Route::post('thread/{thread_id}/drafts', 'InboxController@createDraft');
    Route::put('drafts/{draft_id}', 'InboxController@updateDraft');
});

Route::group(['middleware'=>['jwt.auth'], 'prefix' => 'users/me'], function () {

    //get update me
    Route::get('/', 'UsersController@getMe');
    Route::get('inboxes', 'UsersController@getInboxes');
});


Route::group(['middleware'=>['jwt.auth','adminOnly'], 'prefix' => 'settings'], function () {
    Route::get('inboxes', 'SettingsController@getInboxes');
    Route::put('inboxes', 'SettingsController@putInboxes');
    Route::get('userevents', 'SettingsController@getUserEvents');
});