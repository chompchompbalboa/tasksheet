<?php

namespace App\Http\Controllers;

use App\Models\SheetCell;
use App\Models\SheetRow;
use Illuminate\Http\Request;

class SheetRowController extends Controller
{
    public function store(Request $request)
    {
      $newRows = $request->all();
      foreach($newRows as $newRow) {
        $sheetRow = SheetRow::create($newRow);
        foreach($newRow['cells'] as $newCell) {
          SheetCell::create($newCell);
        }
      }
      return response()->json(null, 200);
    }

    public function destroy(SheetRow $row)
    {
      SheetCell::where('rowId', $row->id)->delete();
      $row->delete();
      return response()->json(null, 204);
    }

    public function batchDestroy(Request $request)
    {
      $rowIds = $request->all();
      foreach($rowIds as $rowId) {
        SheetCell::where('rowId', $rowId)->delete();
      }
      SheetRow::destroy($rowIds);
      return response()->json(null, 204);
    }
  
    public function restore(Request $request)
    {
      // Get the row and cell ids
      $rowIds = $request->input('rowIds');
      $cellIds = $request->input('cellIds');
      
      // Restore the rows
      SheetRow::withTrashed()->whereIn('id', $rowIds)->restore();
      
      // Restore the cells
      SheetCell::withTrashed()->whereIn('id', $cellIds)->restore();
      
      return response()->json(null, 200);
    }
}
