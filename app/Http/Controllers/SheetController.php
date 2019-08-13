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
      $newSheet = new Sheet;
      $newSheet->save();
      // Build the array we'll use to insert the columns, rows, and cells
      $rowsFromCsv = Csv::toArray($request->file('fileToUpload')->path());
      $rowsFromCsvCount = count($rowsFromCsv);
      // Create the columns
      $columns = [];
      foreach($rowsFromCsv[0] as $columnName => $value) {
        array_push($columns, [
          'id' => Str::uuid()->toString(),
          'sheetId' => $newSheet->id,
          'name' => $columnName,
          'type' => 'STRING',
          'width' => 100
        ]);
      }
      $newSheetColumns = SheetColumn::insert($columns);
      // Create the rows and cells
      $newSheetRows = [];
      $newSheetCells = [];      
      return response()->json(null, 200);
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
