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
          'typeId' => 'STRING',
          'width' => 100
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


    public static function createSheetColumnsRowsAndCellsFromArrayOfRows($newSheet, $arrayOfRows) {

      // Count the number of rows
      $arrayOfRowsCount = count($arrayOfRows);

      // Tasksheet gives users the option to store configuration data about
      // the sheet when downloading. If they choose to include that data, it is
      // saved to the first row of the downloaded sheet. Here, we're checking
      // the first row to see if the configuration data exists and if it does,
      // setting it up for use during sheet creation
      $arrayFirstRowCells = $arrayOfRows[0];
      $arrayFirstRowFirstCellValue = $arrayOfRows[0][array_keys($arrayOfRows[0])[0]];
      $isSortsheetConfigurationDataIncluded = Str::contains($arrayFirstRowFirstCellValue, '[TS]');
      $cellTypes = [];
      if($isSortsheetConfigurationDataIncluded) {
        foreach($arrayFirstRowCells as $currentCell) {
          // Load the configuration data into an array by using the end bracket as a delimiter
          $currentCellsSortsheetConfigurationData = explode(']', $currentCell);
           // The first configuration data point is always the cell type
          $currentCellType = str_replace('[', '', $currentCellsSortsheetConfigurationData[1]);
          array_push($cellTypes, $currentCellType);
        }
        // Remove the row containing the configuration data from the input array
        array_splice($arrayOfRows, 0, 1);
      }

      // Create the sheet's columns by building an array that will be bulk 
      // inserted into the database. During column creation, we also build 
      // the sheet view's visible columns
      $newSheetColumns = [];
      $columnIds = [];
      $currentColumnIndex = 0;
      foreach($arrayOfRows[0] as $columnName => $cellValue) {
        // Bail out if the current column is a column break
        if(!Str::contains($columnName, 'COLUMN_BREAK')) {

          // Create the new column.
          $newColumnId = Str::uuid()->toString();
          $nextColumnWidth = max(50, strlen($columnName) * 8);
          array_push($newSheetColumns, [
            'id' => $newColumnId,
            'sheetId' => $newSheet->id,
            'name' => $columnName,
            'typeId' => $isSortsheetConfigurationDataIncluded 
              ? $cellTypes[$currentColumnIndex] 
              : SheetUtils::getColumnType($cellValue),
            'width' => $nextColumnWidth
          ]);

          // Add the new column id to the sheet view's visible columns
          $columnIds[$currentColumnIndex] = $newColumnId;
        }
        else {
          // If it is a column break, add it to the sheet view's visible columns
          $columnIds[$currentColumnIndex] = 'COLUMN_BREAK';
        }
        $currentColumnIndex++;
      }

      // Create the sheet's row and cell's by building an array that will be 
      // bulk inserted into the database. 
      $newSheetRows = [];
      $newSheetCells = [];
      foreach($arrayOfRows as $rowFromCsv) {

        // Bail out if this row contains configuration data
        $firstCellValue = $rowFromCsv[array_keys($rowFromCsv)[0]];
        if(!Str::contains($firstCellValue, '[TS]')) {

          // Create the new row
          $newRowId = Str::uuid()->toString();
          array_push($newSheetRows, [ 
            'id' => $newRowId,
            'sheetId' => $newSheet->id 
          ]);
  
          // Create the new cells
          foreach($newSheetColumns as $index => $column) {
            $cellValue = $rowFromCsv[$column['name']];
            array_push($newSheetCells, [
              'id' => Str::uuid()->toString(),
              'sheetId' => $newSheet->id,
              'columnId' => $column['id'],
              'rowId' => $newRowId,
              'value' => $cellValue
            ]);
            $cellValueLength = strlen($cellValue);
            $defaultColumnWidth = $newSheetColumns[$index]['width'];
            $newColumnWidth = min(300, max($cellValueLength * 8, $defaultColumnWidth));
            $newSheetColumns[$index]['width'] = $newColumnWidth;
          }
        }
      }

      // Save the sheet columns
      SheetColumn::insert($newSheetColumns);

      // Save the sheet rows
      foreach (array_chunk($newSheetRows, 2500) as $chunk) {
        SheetRow::insert($chunk);
      }

      // Save the sheet cells
      foreach (array_chunk($newSheetCells, 2500) as $chunk) {
        SheetCell::insert($chunk);
      }  

      return $columnIds;
    }

    public static function prepareSheetDownload(Request $request, Sheet $sheet)
    {
      // Request inputs
      $filename = $request->input('filename');
      $includeAssets = $request->input('includeAssets');
      $includeColumnTypeInformation = $request->input('includeColumnTypeInformation');
      $visibleRows = $request->input('visibleRows');
      
      // Variables
      $downloadId = Str::uuid()->toString();
      $csvPath = $downloadId.'/'.$filename.'.csv';
      
      // Csv
      $sheetCsv = SheetUtils::createCsv($sheet, $includeColumnTypeInformation, $visibleRows);
      Storage::disk('downloads')->put($csvPath, $sheetCsv);
      
      return response()->json($downloadId, 200);
    }

    public static function downloadSheet($sheetDownloadId)
    {

        $path = storage_path('app/public/downloads/'.$sheetDownloadId);
        $zipFile = $path.'/tracksheet.zip';
        $zip = new \ZipArchive();
        $zip->open($zipFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));
        foreach ($files as $name => $file) {
          if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($path) + 1);
            $zip->addFile($filePath, $relativePath);
          }
        }
        $zip->close();
        return response()->download($zipFile);
    }
}
