<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SheetPriority;
use App\Models\SheetCellPriority;

class SheetPriorityController extends Controller
{
    public function store(Request $request)
    {
      $newSheetPriority = SheetPriority::create([
        'id' => $request->input('id'),
        'sheetId' => $request->input('sheetId'),
        'name' => 'New Priority',
        'backgroundColor' => $request->input('backgroundColor'),
        'color' => $request->input('color'),
        'order' => $request->input('order'),
      ]);
      return response()->json($newSheetPriority, 200);
    }

    public function update(Request $request, SheetPriority $priority)
    {
      $priority->update($request->all());
      return response()->json(null, 200);
    }

    public function destroy(SheetPriority $priority)
    {
      SheetCellPriority::where('priorityId', $priority->id)->delete();
      $priority->delete();
      return response()->json(null, 204);
    }
}
