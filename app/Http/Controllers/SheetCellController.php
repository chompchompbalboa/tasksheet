<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SheetCell;

class SheetCellController extends Controller
{
    public function store(Request $request)
    {
      return SheetCell::create($request->all());
    }

    public function update(Request $request, SheetCell $cell)
    {
      $cell->update($request->all());
      return response()->json(null, 200);
    }

    public function batchUpdate(Request $request)
    {
      $updates = $request->all();
      foreach($updates as $update) {
        SheetCell::find($update['id'])->update($update);
      }
      return response()->json(null, 200);
    }
}
