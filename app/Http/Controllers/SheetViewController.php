<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetFilter;
use App\Models\SheetGroup;
use App\Models\SheetSort;
use App\Models\SheetStyles;

class SheetViewController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      // View
      $newSheetViewId = $request->input('id');
      $sourceSheetId = $request->input('sourceSheetId');
      $visibleColumns = $request->input('visibleColumns');
      $defaultVisibleRows = $request->input('defaultVisibleRows');
      $newSheetView = Sheet::create([ 
        'id' => $newSheetViewId, 
        'sourceSheetId' => $sourceSheetId, 
        'defaultVisibleRows' => $defaultVisibleRows,
        'visibleColumns' => $visibleColumns 
      ]);
      $newSheetStyles = SheetStyles::create([ 'id' => Str::uuid()->toString(), 'sheetId' => $newSheetViewId ]);
      // Filters
      $newSheetViewFilters = $request->input('filters');
      foreach($newSheetViewFilters as $sheetViewFilter) {
        $newSheetView->filters()->create($sheetViewFilter);
      }
      // Groups
      $newSheetViewGroups = $request->input('groups');
      foreach($newSheetViewGroups as $sheetViewGroup) {
        $newSheetView->groups()->create($sheetViewGroup);
      }
      // Sorts
      $newSheetViewSorts = $request->input('sorts');
      foreach($newSheetViewSorts as $sheetViewSort) {
        $newSheetView->sorts()->create($sheetViewSort);
      }
      return response()->json($newSheetView, 200);
    }
}
