<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Models\Sheet;

class SheetViewController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      dd($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public static function show(SheetView $view)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetView $view)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetView $view)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetView $view)
    {
    }
}
