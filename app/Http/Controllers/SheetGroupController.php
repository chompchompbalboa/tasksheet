<?php

namespace App\Http\Controllers;

use App\Models\SheetGroup;
use Illuminate\Http\Request;

class SheetGroupController extends Controller
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
      $sheetGroup = SheetGroup::create($request->all());
      return response()->json($sheetGroup, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SheetGroup  $group
     * @return \Illuminate\Http\Response
     */
    public function show(SheetGroup $group)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\SheetGroup  $group
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetGroup $group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SheetGroup  $group
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetGroup $group)
    {
      $group->update($request->all());
      return response()->json($group, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SheetGroup  $group
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetGroup $group)
    {
      $group->delete();
      return response()->json(null, 204);
    }
}
