<?php

namespace App\Http\Controllers;

use App\Models\SheetStyles;
use Illuminate\Http\Request;

class SheetStylesController extends Controller
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
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Cell  $styles
     * @return \Illuminate\Http\Response
     */
    public function show(SheetStyles $styles)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Cell  $styles
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetStyles $styles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Cell  $styles
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      $styles = SheetStyles::find($id);
      $styles->update($request->all());
      return response()->json(null, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Cell  $styles
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cell $styles)
    {
        //
    }
}
