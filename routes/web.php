<?php
//-----------------------------------------------------------------------------
// Use
//-----------------------------------------------------------------------------

use Illuminate\Support\Facades\Auth;

use App\Models\Active;
use App\Models\Collection;
use App\Models\Container;
use App\Models\View;

//-----------------------------------------------------------------------------
// Site
//-----------------------------------------------------------------------------
Route::group([], function () {
  Route::get('/', function () {
    
    if(Auth::check()) {
      $user = Auth::user();
    }
    else {
      Auth::attempt([
        'email' => 'demo@sortsheet.com',
        'password' => 'secret'
      ]);
      $user = Auth::user();
    }
    //dd($user->files()->toArray());

    return view('app')->with([
      'user' => $user,
      'folders' => $user->folders(),
      'files' => $user->files(),
    ]);
  })->name('site');
});

//-----------------------------------------------------------------------------
// App
//-----------------------------------------------------------------------------
Route::group([
  'prefix' => 'app',
  'middleware' => [ 'auth' ]
], function () {
  // Uploads
  Route::post('/sheets/upload/csv', 'SheetController@createFromCsv');
  Route::post('/sheets/cells/photos/upload', 'SheetCellPhotoController@uploadPhotos');
  Route::post('/sheets/cells/files/upload', 'SheetCellFileController@uploadFiles');
  
  // Downloads
  Route::post('/sheets/prepare-download/{sheet}', 'SheetController@prepareSheetDownload');
  Route::get('/sheets/download/{sheet}', 'SheetController@downloadSheet');
  Route::get('/sheets/cells/files/download/{file}', 'SheetCellFileController@downloadFiles');
  Route::get('/sheets/cells/photos/download/{file}', 'SheetCellPhotoController@downloadPhotos');
  
  // Restore soft deleted models
  Route::post('/folders/restore/{folder}', 'FolderController@restore');
  Route::post('/files/restore/{file}', 'FileController@restore');
  Route::post('/sheets/columns/restore/{column}', 'SheetColumnController@restore');
  Route::post('/sheets/rows/restore', 'SheetRowController@restore');
  Route::post('/sheets/views/restore/{sheetView}', 'SheetViewController@restore');
  Route::post('/sheets/filters/restore/{filter}', 'SheetFilterController@restore');
  Route::post('/sheets/groups/restore/{group}', 'SheetGroupController@restore');
  Route::post('/sheets/sorts/restore/{sort}', 'SheetSortController@restore');
  Route::post('/sheets/cells/priorities/restore', 'SheetCellPriorityController@restore');

  // Batch actions
  Route::patch('/sheets/cells/batch/update', 'SheetCellController@batchUpdate');
  Route::post('/sheets/cells/priorities', 'SheetCellPriorityController@batchCreate');
  Route::post('/sheets/cells/priorities/delete', 'SheetCellPriorityController@batchDelete');
  Route::post('/sheets/rows/batch/delete', 'SheetRowController@batchDestroy');

  // Reset Sheet View
  Route::post('/sheets/views/reset/{sheetViewId}', 'SheetViewController@reset');
  
  // Team Members
  Route::post('/team/member/create', 'TeamMemberController@store');
  Route::post('/team/member/delete', 'TeamMemberController@destroy');

  // User Subscriptions
  Route::post('/user/{user}/subscription/purchase/lifetime', 'UserSubscriptionPurchaseController@subscriptionPurchaseLifetime');
  Route::post('/user/{user}/subscription/purchase/monthly', 'UserSubscriptionPurchaseController@subscriptionPurchaseMonthly');
  
  // Resource Controllers
  Route::resources([
    // Team
    'team' => 'TeamController',
    // Folders
    'folders' => 'FolderController',
    'folders/permissions' => 'FolderPermissionController',
    'files' => 'FileController',
    'files/permissions' => 'FilePermissionController',
    // Sheet
    'sheets' => 'SheetController',
    'sheets/cells' => 'SheetCellController',
    'sheets/cells/photos' => 'SheetCellPhotoController',
    'sheets/cells/files' => 'SheetCellFileController',
    'sheets/cells/changes' => 'SheetCellChangeController',
    'sheets/columns' => 'SheetColumnController',
    'sheets/filters' => 'SheetFilterController',
    'sheets/groups' => 'SheetGroupController',
    'sheets/links' => 'SheetLinkController',
    'sheets/rows' => 'SheetRowController',
    'sheets/priorities' => 'SheetPriorityController',
    'sheets/sorts' => 'SheetSortController',
    'sheets/styles' => 'SheetStylesController',
    'sheets/views' => 'SheetViewController',
    // User
    'user' => 'UserController',
    'user/active' => 'UserActiveController',
    'user/color' => 'UserColorController',
    'user/layout' => 'UserLayoutController',
    'user/subscription' => 'UserSubscriptionController',
  ]);
});

//-----------------------------------------------------------------------------
// Authentication
//-----------------------------------------------------------------------------
Route::namespace('Auth')->group(function () {
  Route::post('/user/login', 'LoginController@login');
  Route::post('/user/logout', 'LoginController@logout');
  Route::post('/user/register', 'RegisterController@register');
});