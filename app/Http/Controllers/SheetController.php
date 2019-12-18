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

      // Create the new sheet
      $this->sheetBuilder->createSheet($newSheetId);

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
