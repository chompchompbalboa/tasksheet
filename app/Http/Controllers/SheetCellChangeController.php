<?php

namespace App\Http\Controllers;

use App\Models\SheetCellChange;
use Illuminate\Http\Request;

class SheetCellChangeController extends Controller
{
    public function store(Request $request)
    {
      $newSheetCellChange = SheetCellChange::create($request->all());
      return response()->json($newSheetCellChange, 200);
    }

    public function destroy(SheetCellChange $change)
    {
      $change->delete();
      return response()->json(null, 204);
    }
}
