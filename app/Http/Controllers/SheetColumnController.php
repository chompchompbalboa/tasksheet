<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Sheet;
use App\Models\SheetCell;
use App\Models\SheetColumn;
use App\Models\SheetRow;

class SheetColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $sheetColumn = SheetColumn::create($request->input('newColumn'));
      foreach($request->input('newCells') as $newCell) {
        SheetCell::create($newCell);
      }
      return response()->json($sheetColumn, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Column  $column
     * @return \Illuminate\Http\Response
     */
    public function show(SheetColumn $column)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Column  $column
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetColumn $column)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Column  $column
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetColumn $column)
    {
      $column->update($request->all());
      return response()->json($column, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Column  $column
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetColumn $column)
    {
      // Delete all of the cells
      SheetCell::where('sheet_column_id', $column->id)->delete();
      // If deleting the sheet's only column, delete any rows as well
      $columnCount = Sheet::where('id', $column->sheetId)->first()->columns()->count();
      if($columnCount === 1) {
        SheetRow::where('sheet_id', $column->sheetId)->delete();
      }
      return SheetColumn::destroy($column->id);
    }
}
