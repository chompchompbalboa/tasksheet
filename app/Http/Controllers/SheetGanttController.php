<?php

namespace App\Http\Controllers;

use App\Models\SheetGantt;
use App\Models\SheetGanttRange;
use Illuminate\Http\Request;

class SheetGanttController extends Controller
{
    public function store(Request $request)
    {
      // Create the new sheet gantt
      $newSheetGantt = $request->input('newSheetGantt');
      SheetGantt::withTrashed()
        ->where('sheetId', $newSheetGantt['sheetId'])
        ->where('columnId', $newSheetGantt['columnId'])
        ->delete();
      SheetGantt::create($newSheetGantt);
      
      // Create the new sheet gantt ranges
      $newSheetGanttRanges = $request->input('newSheetGanttRanges');
      foreach($newSheetGanttRanges as $newSheetGanttRange) {
        SheetGanttRange::create($newSheetGanttRange);
      }
      return response(null, 200);
    }

    public function update(Request $request, SheetGantt $gantt)
    {
      $gantt->update($request->all());
      return response(null, 200);
    }

    public function destroy(SheetGantt $gantt)
    {
      $gantt->delete();
      return response(null, 204);
    }
  
    public function restore(Request $request)
    { 
      SheetGantt::withTrashed()
        ->whereIn('id', $request->input('sheetGanttIds'))
        ->restore();
      return response(null, 200);
    }
}
