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
Route::prefix('app')->group(function () {
  

  // Initial load
  Route::get('/', function () {
    $user = Auth::loginUsingId('75e3c4f9-b261-3343-a320-8ee9fb0c931e', true);
    $organization = $user->organization;

    $userFolders = $user->folder()->get();
    $organizationFolders = $organization->folder()->get();
    $folders = $userFolders->merge($organizationFolders)->values()->all();
    
    return view('app')->with([
      'user' => $user,
      'folders' => $folders
    ]);
  });

  /*
  // Copy
  Route::post('/calendars/copy', 'CalendarController@copyFromRequest');
  Route::post('/folders/copy', 'FolderController@copyFromRequest');
  Route::post('/notes/copy', 'NoteController@copyFromRequest');
  Route::post('/sheets/copy', 'SheetController@copyFromRequest');
  */
  // Resource Controllers
  Route::resources([
    /*
    // Folders
    'folders' => 'FolderController',
    'files' => 'FileController',
    // Calendars
    'calendars' => 'CalendarController',
    // Notes
    'notes' => 'NoteController',
    // Sheet
    'sheets' => 'SheetController',
    'sheets/breakdowns' => 'SheetBreakdownController',
    'sheets/cells' => 'SheetCellController',
    'sheets/columns' => 'SheetColumnController',
    'sheets/breakdowns/formulas' => 'SheetBreakdownFormulaController',
    'sheets/rows' => 'SheetRowController'
    */
    // User
    'user/color' => 'UserColorController',
    'user/layout' => 'UserLayoutController',
  ]);
});

//-----------------------------------------------------------------------------
// Site
//-----------------------------------------------------------------------------
Route::get('/', function () {
  return view('site');
});

//-----------------------------------------------------------------------------
// Authentication
//-----------------------------------------------------------------------------
Auth::routes();