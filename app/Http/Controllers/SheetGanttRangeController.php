<?php

namespace App\Http\Controllers;

use App\Models\SheetGanttRange;
use Illuminate\Http\Request;

class SheetGanttRangeController extends Controller
{
    public function store(Request $request)
    {
      $newSheetGanttRanges = $request->input('newSheetGanttRanges');
      foreach($newSheetGanttRanges as $newSheetGanttRange) {
        SheetGanttRange::create($newSheetGanttRange);
      }
      return response(null, 200);
    }

    public function update(Request $request, SheetGanttRange $range)
    {
      $range->update($request->all());
      return response(null, 200);
    }

    public function destroy(SheetGanttRange $label)
    {
      $label->delete();
      return response()->json(null, 204);
    }

    public function batchDelete(Request $request) {
      SheetGanttRange::destroy($request->input('sheetGanttRangeIds'));
      return response(null, 200);
    }
  
    public function restore(Request $request)
    { 
      SheetGanttRange::withTrashed()
        ->whereIn('id', $request->input('sheetGanttRangeIds'))
        ->restore();
      return response()->json(null, 200);
    }
}
