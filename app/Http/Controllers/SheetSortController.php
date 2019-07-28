<?php

namespace App\Http\Controllers;

use App\Models\SheetSort;
use Illuminate\Http\Request;

class SheetSortController extends Controller
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
      $sheetSort = SheetSort::create($request->all());
      return response()->json($sheetSort, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SheetSort  $sort
     * @return \Illuminate\Http\Response
     */
    public function show(SheetSort $sort)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\SheetSort  $sort
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetSort $sort)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SheetSort  $sort
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetSort $sort)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SheetSort  $sort
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetSort $sort)
    {
      $sort->delete();
      return response()->json(null, 204);
    }
}
