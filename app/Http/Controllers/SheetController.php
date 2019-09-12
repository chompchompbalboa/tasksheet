<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\SheetCell;
use App\Models\SheetColumn;
use App\Models\SheetRow;
use App\Models\Sheet;

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
    for($rowNumber = 0; $rowNumber <= 5; $rowNumber++) {
      $newRowId = Str::uuid()->toString();
      array_push($newRows, [ 
        'id' => $newRowId,
        'sheetId' => $newSheet->id 
      ]);
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
            'typeId' => SheetUtils::getColumnType($value),
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
      foreach($arrayOfRows as $rowFromCsv) {
        $newRowId = Str::uuid()->toString();
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
      $newSheet->save();
      foreach (array_chunk($newSheetRows, 2500) as $chunk) {
        SheetRow::insert($chunk);
      }
      foreach (array_chunk($newSheetCells, 2500) as $chunk) {
        SheetCell::insert($chunk);
      }  
      
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
