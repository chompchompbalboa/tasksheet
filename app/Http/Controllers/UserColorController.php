<?php

namespace App\Http\Controllers;

use App\Models\UserColor;
use Illuminate\Http\Request;

class UserColorController extends Controller
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
     * @param  \App\UserColor  $color
     * @return \Illuminate\Http\Response
     */
    public function show(UserColor $color)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\UserColor  $color
     * @return \Illuminate\Http\Response
     */
    public function edit(UserColor $color)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Model\UserColor  $color
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserColor $color)
    { 
      $color->update($request->all());
      return response()->json($color, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\UserColor  $color
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserColor $color)
    {
        //
    }
}
