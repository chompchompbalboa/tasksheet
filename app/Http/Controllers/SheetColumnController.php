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
      foreach($request->input('newColumns') as $newColumn) {
        SheetColumn::create($newColumn);
      }
      foreach($request->input('newCells') as $newCell) {
        SheetCell::create($newCell);
      }
      return response(null, 200);
    }

    public function update(Request $request, SheetColumn $column)
    {
      $column->update($request->all());
      return response($column, 200);
    }

    public function batchDestroy(Request $request)
    {
      $columnIds = $request->input('columnIds');
      foreach($columnIds as $columnId) {

        // Get the column
        $column = SheetColumn::find($columnId);

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
      }
      return response(null, 200);
    }

    public function restore(Request $request)
    {
      $columnIds = $request->input('columnIds');
      foreach($columnIds as $columnId) {
        // Get the column
        $column = SheetColumn::withTrashed()
                  ->where('id', $columnId)
                  ->first();

        // Make sure the column exists
        if($column) {
          
          // Get the deleted at timestamp before restoring the column
          // We need to query the related models by the deleted_at timestamp
          // to ensure that we're not restoring items that were deleted prior
          // to the column being deleted
          $deletedAt = $column->deleted_at->toDateTimeString();
  
          // Restore the column
          $column->restore();
  
          // Restore the cells 
          SheetCell::withTrashed()
            ->where('columnId', $columnId)
            ->where('deleted_at', $deletedAt)
            ->restore();
  
          // Restore the filters
          SheetFilter::withTrashed()
            ->where('columnId', $columnId)
            ->where('deleted_at', $deletedAt)
            ->restore();
  
          // Restore the groups
          SheetGroup::withTrashed()
            ->where('columnId', $columnId)
            ->where('deleted_at', $deletedAt)
            ->restore();
  
          // Restore the sorts
          SheetSort::withTrashed()
            ->where('columnId', $columnId)
            ->where('deleted_at', $deletedAt)
            ->restore();
        }
        else {
          return response(false, 404);
        }
      }
      return response(true, 200);
    }
}
