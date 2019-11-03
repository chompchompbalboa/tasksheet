<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetStyles;
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
        'visibleColumns' => $newActiveSheetViewVisibleColumns 
      ]);
      $newSheet->activeSheetViewId = $newActiveSheetViewId;
      $newSheet->save();

      $newSheetStyles = SheetStyles::create([ 'id' => Str::uuid()->toString(), 'sheetId' => $newSheetId ]);

      return response()->json(null, 200);
    }
}
