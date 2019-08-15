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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      SheetColumn::create($request->input('newColumn'));
      SheetCell::insert($request->input('newCells'));
      return response()->json(null, 200);
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
      SheetCell::where('columnId', $column->id)->delete();
      // If deleting the sheet's only column, delete any rows as well
      $columnCount = SheetColumn::where('sheetId', $column->sheetId)->count();
      if($columnCount === 1) {
        SheetRow::where('sheetId', $column->sheetId)->delete();
      }
      return SheetColumn::destroy($column->id);
    }
}
