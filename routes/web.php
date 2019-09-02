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
// App
//-----------------------------------------------------------------------------
Route::group([
  'prefix' => 'app',
  'middleware' => [ 'auth' ]
], function () {
  // Initial load
  Route::get('/', function () {
    //$user = Auth::loginUsingId('75e3c4f9-b261-3343-a320-8ee9fb0c931e', true);
    $user = Auth::user();
    //$organization = $user->organization;

    $userFolders = $user->folder()->get();
    $userColumnTypes = $user->columnTypes();
    //$organizationFolders = $organization->folder()->get();
    //$folders = $organizationFolders->merge($userFolders)->values()->all();
    return view('app')->with([
      'user' => $user,
      'folders' => $userFolders,
      'columnTypes' => $userColumnTypes
    ]);
  })->name('app');

  // Uploads
  Route::post('/sheets/upload/csv', 'SheetController@createFromCsv');
  
  // Restore soft deletes
  Route::post('/files/restore/{file}', 'FileController@restore');

  /*
  // Copy
  Route::post('/calendars/copy', 'CalendarController@copyFromRequest');
  Route::post('/folders/copy', 'FolderController@copyFromRequest');
  Route::post('/notes/copy', 'NoteController@copyFromRequest');
  Route::post('/sheets/copy', 'SheetController@copyFromRequest');
  */
  // Resource Controllers
  Route::resources([
    
    // Folders
    'folders' => 'FolderController',
    'files' => 'FileController',
    /*
    // Calendars
    'calendars' => 'CalendarController',
    // Notes
    'notes' => 'NoteController',
    */
    // Sheet
    'sheets' => 'SheetController',
    'sheets/cells' => 'SheetCellController',
    'sheets/columns' => 'SheetColumnController',
    'sheets/filters' => 'SheetFilterController',
    'sheets/groups' => 'SheetGroupController',
    'sheets/rows' => 'SheetRowController',
    'sheets/sorts' => 'SheetSortController',
    'sheets/views' => 'SheetViewController',
    // User
    'user/active' => 'UserActiveController',
    'user/color' => 'UserColorController',
    'user/layout' => 'UserLayoutController',
  ]);
});

//-----------------------------------------------------------------------------
// Site
//-----------------------------------------------------------------------------
Route::group([
  'middleware' => [ 'guest' ]
], function () {
  Route::get('/', function () {
    return view('site');
  })->name('site');

});

//-----------------------------------------------------------------------------
// Authentication
//-----------------------------------------------------------------------------
Route::namespace('Auth')->group(function () {
  Route::post('/user/login', 'LoginController@login');
  Route::post('/user/logout', 'LoginController@logout');
  Route::post('/user/register', 'RegisterController@register');
});