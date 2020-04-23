<?php

namespace App\Http\Controllers;

use App\Models\SheetCellLabel;
use Illuminate\Http\Request;

class SheetCellLabelController extends Controller
{
    public function store(Request $request)
    {
      $newSheetCellLabels = $request->input('newSheetCellLabels');
      foreach($newSheetCellLabels as $newSheetCellLabel) {
        SheetCellLabel::create($newSheetCellLabel);
      }
      return response(null, 200);
    }

    public function destroy(SheetCellLabel $label)
    {
      $label->delete();
      return response()->json(null, 204);
    }

    public function batchDelete(Request $request) {
      SheetCellLabel::destroy($request->input('sheetCellLabelIds'));
      return response(null, 200);
    }
  
    public function restore(Request $request)
    { 
      SheetCellLabel::withTrashed()
        ->whereIn('id', $request->input('sheetCellLabelIds'))
        ->restore();
      return response()->json(null, 200);
    }
}
