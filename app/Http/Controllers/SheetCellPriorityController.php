<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SheetCellPriority;

class SheetCellPriorityController extends Controller
{    
  public function batchCreate(Request $request)
  {
    foreach($request->all() as $sheetCellPriority) {
      SheetCellPriority::updateOrCreate(
        [ 
          'id' => $sheetCellPriority['id'] 
        ],
        [
          'id' => $sheetCellPriority['id'],
          'sheetId' => $sheetCellPriority['sheetId'],
          'cellId' => $sheetCellPriority['cellId'],
          'priorityId' => $sheetCellPriority['priorityId'],
        ]
      );
    }
    return response()->json(null, 200);
  }

  public function batchDelete(Request $request)
  {
    SheetCellPriority::destroy($request->all());
    return response()->json(null, 204);
  }
  
  public function restore(Request $request)
  { 
    SheetCellPriority::withTrashed()
      ->whereIn('id', $request->input('sheetCellPriorityIds'))
      ->restore();
    return response()->json(null, 200);
  }
}
