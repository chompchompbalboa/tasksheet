<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetStyles;
use App\Models\SheetPriority;
use App\Models\SheetView;

class SheetLinkController extends Controller
{
    public function store(Request $request)
    {
      $newSheetId = $request->input('id');
      $newActiveSheetViewId = $request->input('activeSheetViewId');
      $newActiveSheetViewName = $request->input('activeSheetViewName');
      $newActiveSheetViewVisibleColumns = $request->input('activeSheetViewVisibleColumns');
      $sourceSheetId = $request->input('sourceSheetId');

      $newSheet = Sheet::create([ 
        'id' => $newSheetId, 
        'sourceSheetId' => $sourceSheetId
      ]);

      $newSheetView = SheetView::create([
        'id' => $newActiveSheetViewId,
        'sheetId' => $newSheetId,
        'name' => $newActiveSheetViewName,
        'visibleColumns' => $newActiveSheetViewVisibleColumns,
        'isLocked' => false
      ]);
      $newSheet->activeSheetViewId = $newActiveSheetViewId;
      $newSheet->save();

      $newSheetStyles = SheetStyles::create([ 'id' => Str::uuid()->toString(), 'sheetId' => $newSheetId ]);
    
      // Create the default sheet priorities
      $prioritiesToCreate = [
        [ 'name' => 'Now', 'backgroundColor' => 'rgb(255, 150, 150)', 'color' => 'black', 'order' => 1 ],
        [ 'name' => 'Soon', 'backgroundColor' => 'rgb(255, 205, 155)', 'color' => 'black', 'order' => 2 ],
        [ 'name' => 'Flagged', 'backgroundColor' => 'rgb(255, 255, 160)', 'color' => 'black', 'order' => 3 ],
      ];
      foreach($prioritiesToCreate as $priorityToCreate) {
        SheetPriority::create([
          'id' => Str::uuid()->toString(),
          'sheetId' => $newSheet->id,
          'name' => $priorityToCreate['name'],
          'backgroundColor' => $priorityToCreate['backgroundColor'],
          'color' => $priorityToCreate['color'],
          'order' => $priorityToCreate['order'],
        ]);
      }

      return response()->json(null, 200);
    }
}
