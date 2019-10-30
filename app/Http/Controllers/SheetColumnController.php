<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SheetCell;
use App\Models\SheetColumn;
use App\Models\SheetRow;

class SheetColumnController extends Controller
{
    public function store(Request $request)
    {
      SheetColumn::create($request->input('newColumn'));
      foreach($request->input('newCells') as $newCell) {
        SheetCell::create($newCell);
      }
      return response()->json(null, 200);
    }

    public function update(Request $request, SheetColumn $column)
    {
      $column->update($request->all());
      return response()->json($column, 200);
    }

    public function destroy(SheetColumn $column)
    {
      // Delete all of the cells
      SheetCell::where('columnId', $column->id)->delete();
      // If deleting the sheet's only column, delete any rows as well
      $columnCount = SheetColumn::where('sheetId', $column->sheetId)->count();
      if($columnCount === 1) {
        SheetRow::where('sheetId', $column->sheetId)->delete();
      }
      return SheetColumn::destroy($column->id);
    }
}
