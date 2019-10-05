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

use App\Utils\Csv;
use App\Utils\SheetUtils;

class SheetController extends Controller
{

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    // Create the sheet
    $newSheetId = $request->input('newSheetId');
    $newSheet = Sheet::create([ 'id' => $newSheetId ]);
    $newSheetStyles = SheetStyles::create([ 'id' => Str::uuid()->toString(), 'sheetId' => $newSheetId ]);
    // Create the columns
    $newColumns = [];
    $visibleColumns = [];
    foreach(explode(',', 'A,B,C,D,E,F,G,H') as $columnName) {
      $newColumnId = Str::uuid()->toString();
      array_push($visibleColumns, $newColumnId);
      array_push($newColumns, [
        'id' => $newColumnId,
        'sheetId' => $newSheet->id,
        'name' => $columnName,
        'typeId' => 'STRING',
        'width' => 100
      ]);
    }
    // Create the rows and cells
    $newRows = [];
    $newCells = [];
    $defaultVisibleRows = [];
    for($rowNumber = 0; $rowNumber < 5; $rowNumber++) {
      $newRowId = Str::uuid()->toString();
      array_push($newRows, [ 
        'id' => $newRowId,
        'sheetId' => $newSheet->id
      ]);
      array_push($defaultVisibleRows, $newRowId);
      foreach($newColumns as $index => $column) {
        array_push($newCells, [
          'id' => Str::uuid()->toString(),
          'sheetId' => $newSheet->id,
          'columnId' => $column['id'],
          'rowId' => $newRowId,
          'value' => null
        ]);
      }
    }
    SheetColumn::insert($newColumns);
    SheetRow::insert($newRows);
    SheetCell::insert($newCells);
    $newSheet->visibleColumns = $visibleColumns;
    $newSheet->defaultVisibleRows = $defaultVisibleRows;
    $newSheet->save();
    return response()->json(null, 200);
  }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createFromCsv(Request $request)
    {
      // Create the sheet
      $newSheetId = $request->input('newSheetId');
      $newSheet = Sheet::create([ 'id' => $newSheetId ]);
      $newSheetStyles = SheetStyles::create([ 'id' => Str::uuid()->toString(), 'sheetId' => $newSheetId ]);
      // Build the array we'll use to insert the columns, rows, and cells
      $arrayOfRows = Csv::toArray($request->file('fileToUpload')->path());
      $this->createSheetColumnsRowsAndCellsFromArrayOfRows($newSheet, $arrayOfRows);
      return response()->json(null, 200);
    }

    /**
     * Create a new sheet from an array of rows with the format:
     * [ 'columnName' => 'cellValue', ... ]
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public static function createSheetColumnsRowsAndCellsFromArrayOfRows($newSheet, $arrayOfRows) {
      $firstRow = $arrayOfRows[0];
      $firstRowFirstCellValue = $arrayOfRows[0][array_keys($arrayOfRows[0])[0]];
      $isColumnTypeInformationIncluded = Str::contains($firstRowFirstCellValue, '[TS]');
      $delimiters = ['[', '][', ']'];
      $columnTypes = [];
      if($isColumnTypeInformationIncluded) {
        foreach($firstRow as $columnName => $cellValue) {
          $currentColumnTypeInformation = explode(']', $cellValue);
          $columnType = str_replace('[', '', $currentColumnTypeInformation[1]);
          array_push($columnTypes, $columnType);
        }

        array_splice($arrayOfRows, 0, 1);
      }
      $arrayOfRowsCount = count($arrayOfRows);
      // Create the columns
      $columns = [];
      $visibleColumns = [];
      $currentColumnIndex = 0;
      foreach($arrayOfRows[0] as $columnName => $value) {
        if(!Str::contains($columnName, 'COLUMN_BREAK')) {
          $newColumnId = Str::uuid()->toString();
          $visibleColumns[$currentColumnIndex] = $newColumnId;
          $nextColumnWidth = max(50, strlen($columnName) * 8);
          array_push($columns, [
            'id' => $newColumnId,
            'sheetId' => $newSheet->id,
            'name' => $columnName,
            'typeId' => $isColumnTypeInformationIncluded ? $columnTypes[$currentColumnIndex] : SheetUtils::getColumnType($value),
            'width' => $nextColumnWidth
          ]);
        }
        else {
          $visibleColumns[$currentColumnIndex] = 'COLUMN_BREAK';
        }
        $currentColumnIndex++;
      }
      // Create the rows and cells
      $newSheetRows = [];
      $newSheetCells = [];
      $defaultVisibleRows = [];
      foreach($arrayOfRows as $rowFromCsv) {
        $newRowId = Str::uuid()->toString();
        array_push($defaultVisibleRows, $newRowId);
        array_push($newSheetRows, [ 
          'id' => $newRowId,
          'sheetId' => $newSheet->id 
        ]);
        foreach($columns as $index => $column) {
          $cellValue = $rowFromCsv[$column['name']];
          $cellValueLength = strlen($cellValue);
          $columnWidth = $columns[$index]['width'];
          $nextColumnWidth = min(300, max($cellValueLength * 8, $columnWidth));
          $columns[$index]['width'] = $nextColumnWidth;
          array_push($newSheetCells, [
            'id' => Str::uuid()->toString(),
            'sheetId' => $newSheet->id,
            'columnId' => $column['id'],
            'rowId' => $newRowId,
            'value' => $cellValue
          ]);
        }
      }
      // Insert into db
      $newSheetColumns = SheetColumn::insert($columns);
      $newSheet->visibleColumns = $visibleColumns;
      $newSheet->defaultVisibleRows = $defaultVisibleRows;
      $newSheet->save();
      foreach (array_chunk($newSheetRows, 2500) as $chunk) {
        SheetRow::insert($chunk);
      }
      foreach (array_chunk($newSheetCells, 2500) as $chunk) {
        SheetCell::insert($chunk);
      }  
      
    }

    /**
     * Prepare the sheet download
     *
     * @param  \App\Sheet  $sheet
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Download the sheet
     *
     * @param  \App\Sheet  $sheet
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Display the specified resource.
     *
     * @param  \App\Sheet  $sheet
     * @return \Illuminate\Http\Response
     */
    public static function show(Sheet $sheet)
    {
      return response()->json($sheet, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Sheet  $sheet
     * @return \Illuminate\Http\Response
     */
    public function edit(Sheet $sheet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Sheet  $sheet
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Sheet $sheet)
    {
      $sheet->update($request->all());
      return response()->json(null, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Sheet  $sheet
     * @return \Illuminate\Http\Response
     */
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
}
