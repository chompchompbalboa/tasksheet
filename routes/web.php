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
Route::group([
  'middleware' => [ 'guest' ]
], function () {
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
    
    $teams = $user->teams;

    $folders = [];
    foreach($teams as $team) {
      $teamFolders = $team->folder()->get();
      foreach($teamFolders as $teamFolder) {
        array_push($folders, $teamFolder);
      }
    }
    foreach($user->folder()->get() as $userFolder) {
      array_push($folders, $userFolder);
    }
    
    return view('app')->with([
      'user' => $user,
      'teams' => $teams,
      'folders' => $folders,
      'columnTypes' => $user->columnTypes()
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
  
  // Restore soft deleted files
  Route::post('/files/restore/{file}', 'FileController@restore');

  // Batch actions
  Route::patch('/sheets/cells/batch/update', 'SheetCellController@batchUpdate');
  Route::post('/sheets/cells/priorities', 'SheetCellPriorityController@batchCreate');
  Route::post('/sheets/cells/priorities/delete', 'SheetCellPriorityController@batchDelete');
  Route::post('/sheets/rows/batch/delete', 'SheetRowController@batchDestroy');

  // Reset Sheet View
  Route::post('/sheets/views/reset/{sheet}', 'SheetViewController@reset');
  
  // Team Members
  Route::post('/team/member/create', 'TeamMemberController@store');
  Route::post('/team/member/delete', 'TeamMemberController@destroy');
  
  // Resource Controllers
  Route::resources([
    // Team
    'team' => 'TeamController',
    // Folders
    'folders' => 'FolderController',
    'files' => 'FileController',
    // Sheet
    'sheets' => 'SheetController',
    'sheets/cells' => 'SheetCellController',
    'sheets/cells/photos' => 'SheetCellPhotoController',
    'sheets/cells/files' => 'SheetCellFileController',
    'sheets/cells/notes' => 'SheetCellNoteController',
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