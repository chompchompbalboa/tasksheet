<?php

namespace App\Http\Controllers;

use App\Models\SheetChange;
use Illuminate\Http\Request;

class SheetCellChangeController extends Controller
{
    public function store(Request $request)
    {
      $newSheetChange = SheetChange::create($request->all());
      return response()->json($newSheetChange, 200);
    }

    public function destroy(SheetChange $note)
    {
      $note->delete();
      return response()->json(null, 204);
    }
}
