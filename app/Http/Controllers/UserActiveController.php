<?php

namespace App\Http\Controllers;

use App\Models\UserActive;
use Illuminate\Http\Request;

class UserActiveController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\UserActive  $active
     * @return \Illuminate\Http\Response
     */
    public function show(UserActive $active)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\UserActive  $active
     * @return \Illuminate\Http\Response
     */
    public function edit(UserActive $active)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Model\UserActive  $active
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserActive $active)
    { 
      $active->update($request->all());
      return response()->json($active, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\UserActive  $active
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserActive $active)
    {
        //
    }
}
