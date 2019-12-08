<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\SheetCell;
use App\Models\SheetColumn;
use App\Models\SheetRow;
use App\Models\Sheet;
use App\Models\SheetStyles;
use App\Models\SheetView;

use App\Utils\Csv;
use App\Utils\SheetBuilder;
use App\Utils\SheetUtils;

class SheetController extends Controller
{
  
    public function __construct(SheetBuilder $sheetBuilder) 
    {
      $this->sheetBuilder = $sheetBuilder; 
    }
  
    public static function show(Sheet $sheet)
    {
      return response()->json($sheet, 200);
    }


    public function update(Request $request, Sheet $sheet)
    {
      $sheet->update($request->all());
      return response()->json(null, 200);
    }

    
    public function destroy(Sheet $sheet)
    {
      $rowsToDelete = SheetRow::where('sheetId', $sheet->id)->get();
      foreach($rowsToDelete as $rowToDelete) {
        SheetCell::where('rowId', $rowToDelete->id)->delete();
        SheetRow::destroy($rowToDelete->id);
      }
      SheetColumn::where('sheetId', $sheet->id)->delete();
      return Sheet::destroy($sheet->id);
    }


    public function store(Request $request)
    {
      // Get the request inputs
      $newSheetId = $request->input('newSheetId');

      // Create the sheet
      $newSheet = Sheet::create([ 'id' => $newSheetId ]);

      // Create the sheet view
      $newSheetView = SheetView::create([ 
        'id' => Str::uuid()->toString(), 
        'sheetId' => $newSheetId,
        'name' => 'Default View',
        'visibleColumns' => [],
        'isLocked' => false
      ]);
      $newSheet->activeSheetViewId = $newSheetView->id;
      $newSheet->save();
      
      // Create the sheet styles
      $newSheetStyles = SheetStyles::create([ 
        'id' => Str::uuid()->toString(), 
        'sheetId' => $newSheetId 
      ]);

      // Create the sheet columns
      $newSheetColumns = [];
      $newSheetViewVisibleColumns = [];
      foreach(explode(',', 'A,B,C,D,E') as $columnName) {
        $newColumnId = Str::uuid()->toString();
        array_push($newSheetViewVisibleColumns, $newColumnId);
        array_push($newSheetColumns, [
          'id' => $newColumnId,
          'sheetId' => $newSheet->id,
          'name' => $columnName,
          'cellType' => 'STRING',
          'width' => 100,
          'defaultValue' => null,
          'recordCellHistory' => false
        ]);
      }

      // Create the sheet rows and cells
      $newSheetRows = [];
      $newSheetCells = [];
      for($rowNumber = 0; $rowNumber < 5; $rowNumber++) {
        $newRowId = Str::uuid()->toString();
        array_push($newSheetRows, [ 
          'id' => $newRowId,
          'sheetId' => $newSheet->id
        ]);

        foreach($newSheetColumns as $index => $column) {
          array_push($newSheetCells, [
            'id' => Str::uuid()->toString(),
            'sheetId' => $newSheet->id,
            'columnId' => $column['id'],
            'rowId' => $newRowId,
            'value' => null
          ]);
        }
      }

      // Save the columns, rows, and cells to the database
      SheetColumn::insert($newSheetColumns);
      SheetRow::insert($newSheetRows);
      SheetCell::insert($newSheetCells);

      // Save the sheet view's visibleColumns
      $newSheetView->visibleColumns = $newSheetViewVisibleColumns;
      $newSheetView->save();

      return response()->json(null, 200);
    }


    public function createFromCsv(Request $request)
    {
      // Get the request inputs
      $newSheetId = $request->input('newSheetId');
      $csvFile = $request->file('fileToUpload')->path();

      // Create the sheet
      $newSheet = Sheet::create([ 
        'id' => $newSheetId 
      ]);

      // Create the sheet styles
      $newSheetStyles = SheetStyles::create([ 
        'id' => Str::uuid()->toString(), 
        'sheetId' => $newSheetId 
      ]);

      // Get rows from the csv
      $csvRows = $this->sheetBuilder->getCsvRows($csvFile);

      // Create the sheet columns, rows and cells
      $columnIds = $this->sheetBuilder->createSheetColumnsRowsAndCellsFromCsvRows($newSheet, $csvRows);
      
      // Get and apply the column settings from the csv
      $columnSettings = $this->sheetBuilder->getColumnSettings($csvRows);
      if(!is_null($columnSettings)) { 
        $this->sheetBuilder->applyColumnSettings($columnIds, $columnSettings);
      }

      // Get sheet views from the csv
      $sheetViewsSettings = $this->sheetBuilder->getSheetViewsSettings($csvRows);
      if(!is_null($sheetViewsSettings)) {
        $newSheetViewIds = $this->sheetBuilder->createSheetViews($newSheet->id, $columnIds, $sheetViewsSettings);
        $newSheet->activeSheetViewId = $newSheetViewIds[0];
        $newSheet->save();
      }
      else {
        $newSheetView = SheetView::create([ 
          'id' => Str::uuid()->toString(), 
          'sheetId' => $newSheetId,
          'name' => 'Default View',
          'isLocked' => false,
          'visibleColumns' => $columnIds
        ]);
        $newSheet->activeSheetViewId = $newSheetView->id;
        $newSheet->save();
      }

      // Return the response
      return response()->json(null, 200);
    }
}
