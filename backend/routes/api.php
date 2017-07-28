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
Route::post('auth/onboard', 'AuthController@onboard');
ROute::get('test', 'MailController@test');

Route::post('mailgunhook', 'MailController@mailgunHook');
Route::post('mailgunevent', 'MailController@mailgunEvent');

Route::group(['middleware'=>['jwt.auth']], function () {
    Route::get('inbox/{id}', 'InboxController@getInbox');
    Route::post('inbox/{inbox_id}/threads', 'InboxController@createThread');

    Route::get('thread/{id}', 'InboxController@getThread');

    Route::get('thread/{id}/assignments', 'InboxController@getAssignments');
    Route::put('thread/{id}/assignments', 'InboxController@putAssignments');

    Route::post('thread/{thread_id}/drafts', 'InboxController@createDraft');
    Route::put('drafts/{draft_id}/{action}', 'InboxController@updateDraft');
});

Route::group(['middleware'=>['jwt.auth'], 'prefix' => 'users/me'], function () {

    //get update me
    Route::get('/', 'UsersController@getMe');
    Route::put('/', 'UsersController@updateMe');
    Route::get('inboxes', 'UsersController@getInboxes');
});

Route::group(['middleware'=>['jwt.auth', 'adminOnly'], 'prefix' => 'settings'], function () {
    Route::get('destinationCheck', 'SettingsController@destinationCheck');
    Route::get('inboxes', 'SettingsController@getInboxes');
    Route::put('inboxes', 'SettingsController@putInboxes');
    Route::get('userevents', 'SettingsController@getUserEvents');
    Route::get('groups/{id}', 'SettingsController@getGroup');
    Route::put('groups/{group_id}/users/{user_id}', 'SettingsController@updateGroupMembership');
    Route::get('groups', 'SettingsController@getGroups');
    Route::post('groups', 'SettingsController@createGroup');
    Route::post('users', 'SettingsController@createUser');
    Route::get('groupinboxmatrix', 'SettingsController@getGroupInboxMatrix');
    Route::put('groupinboxmatrix', 'SettingsController@putGroupInboxMatrix');
    Route::get('users', 'SettingsController@getUserList');
    Route::get('users/{id}', 'SettingsController@getUser');
    Route::put('users/{id}', 'SettingsController@putUser');
});
