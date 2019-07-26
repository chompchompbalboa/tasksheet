<?php

namespace App\Http\Controllers;

use App\Models\SheetFilter;
use Illuminate\Http\Request;

class SheetFilterController extends Controller
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
      //dd($request->all());
      $sheetFilter = SheetFilter::create($request->all());
      return response()->json($sheetFilter, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SheetFilter  $filter
     * @return \Illuminate\Http\Response
     */
    public function show(SheetFilter $filter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\SheetFilter  $filter
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetFilter $filter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SheetFilter  $filter
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetFilter $filter)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SheetFilter  $filter
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetFilter $filter)
    {
      $filter->delete();
      return response()->json(null, 204);
    }
}
