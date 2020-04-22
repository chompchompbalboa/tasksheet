<?php

namespace App\Http\Controllers;

use App\Models\SheetCellLabel;
use Illuminate\Http\Request;

class SheetCellLabelController extends Controller
{
    public function store(Request $request)
    {
      $newSheetCellLabel = SheetCellLabel::create($request->all());
      return response()->json($newSheetCellLabel, 200);
    }

    public function destroy(SheetCellLabel $label)
    {
      $label->delete();
      return response()->json(null, 204);
    }

    public function restore(string $labelId)
    {
      $label = SheetCellLabel::withTrashed()->where('id', $labelId)->first();
      if($label) {
        $label->restore();
        return response(null, 200);
      }
      return response(null, 404);
    }
}
