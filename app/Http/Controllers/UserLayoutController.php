<?php

namespace App\Http\Controllers;

use App\Models\UserLayout;
use Illuminate\Http\Request;

class UserLayoutController extends Controller
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
     * @param  \App\UserLayout  $layout
     * @return \Illuminate\Http\Response
     */
    public function show(UserLayout $layout)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\UserLayout  $layout
     * @return \Illuminate\Http\Response
     */
    public function edit(UserLayout $layout)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Model\UserLayout  $layout
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserLayout $layout)
    { 
      $layout->update($request->all());
      return response()->json($layout, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\UserLayout  $layout
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserLayout $layout)
    {
        //
    }
}
