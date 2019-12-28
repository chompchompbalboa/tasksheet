<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SheetColumn;
use App\Models\SheetRow;
use App\Models\SheetCell;
use App\Models\SheetFilter;
use App\Models\SheetGroup;
use App\Models\SheetSort;

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
      // Delete the filters, groups and sorts that reference this column
      SheetFilter::where('columnId', $column->id)->delete();
      SheetGroup::where('columnId', $column->id)->delete();
      SheetSort::where('columnId', $column->id)->delete();

      // Delete all of the cells belonging to this column
      SheetCell::where('columnId', $column->id)->delete();

      // If deleting the sheet's only column, delete any rows as well
      $columnCount = SheetColumn::where('sheetId', $column->sheetId)->count();
      if($columnCount === 1) {
        SheetRow::where('sheetId', $column->sheetId)->delete();
      }

      // Delete the column
      SheetColumn::destroy($column->id);
      return response()->json(null, 200);
    }

    public function restore(string $columnId)
    {
      // Get the deleted column
      $column = SheetColumn::withTrashed()
                ->where('id', $columnId)
                ->first();

      if($column) {
        // Restore the column
        $column->restore();

        // Restore the cells
        SheetCell::withTrashed()->where('columnId', $columnId)->restore();

        // Restore the filters
        SheetFilter::withTrashed()->where('columnId', $columnId)->restore();

        // Restore the groups
        SheetGroup::withTrashed()->where('columnId', $columnId)->restore();

        // Restore the sorts
        SheetSort::withTrashed()->where('columnId', $columnId)->restore();

        return response()->json(true, 200);
      }
      return response()->json(false, 404);
    }
}
