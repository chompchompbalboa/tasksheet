<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetStyles;

class SheetLinkController extends Controller
{
    public function store(Request $request)
    {
      $newSheetId = $request->input('id');
      $sourceSheetId = $request->input('sourceSheetId');
      $visibleColumns = $request->input('visibleColumns');
      $newSheetView = Sheet::create([ 
        'id' => $newSheetId, 
        'sourceSheetId' => $sourceSheetId, 
        'visibleColumns' => $visibleColumns 
      ]);

      $newSheetStyles = SheetStyles::create([ 'id' => Str::uuid()->toString(), 'sheetId' => $newSheetId ]);

      $newSheetViewFilters = $request->input('filters');
      foreach($newSheetViewFilters as $sheetViewFilter) {
        $newSheetView->filters()->create($sheetViewFilter);
      }

      $newSheetViewGroups = $request->input('groups');
      foreach($newSheetViewGroups as $sheetViewGroup) {
        $newSheetView->groups()->create($sheetViewGroup);
      }

      $newSheetViewSorts = $request->input('sorts');
      foreach($newSheetViewSorts as $sheetViewSort) {
        $newSheetView->sorts()->create($sheetViewSort);
      }

      return response()->json($newSheetView, 200);
    }
}
