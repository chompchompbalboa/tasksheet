<?php

namespace App\Http\Controllers;

use App\Models\SheetCell;
use App\Models\SheetRow;
use Illuminate\Http\Request;

class SheetRowController extends Controller
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
      $sheetRow = SheetRow::create($request->input('newRow'));
      foreach($request->input('newCells') as $newCell) {
        SheetCell::create($newCell);
      }
      return response()->json($sheetRow, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Row  $row
     * @return \Illuminate\Http\Response
     */
    public function show(SheetRow $row)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Row  $row
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetRow $row)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Row  $row
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetRow $row)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Row  $row
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetRow $row)
    {
      $row->delete();
      return response()->json(null, 204);
    }
}
