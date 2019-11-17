<?php

namespace App\Http\Controllers;

use App\Models\SheetPriority;
use Illuminate\Http\Request;

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
      $priority->delete();
      return response()->json(null, 204);
    }
}
