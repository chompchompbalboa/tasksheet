<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetView;
use App\Models\SheetFilter;
use App\Models\SheetGroup;
use App\Models\SheetSort;

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
      // View
      $newSheetViewId = $request->input('id');
      $sheetId = $request->input('id');
      $newSheetView = SheetView::create([ 'id' => $newSheetViewId ]);
      // Sheet
      $sheet = Sheet::find($request->input('sheetId'));
      $newSheetView->sheets()->attach($sheet, [ 'id' => Str::uuid()->toString() ]);
      // Filters
      $newSheetViewFilters = $request->input('filters');
      foreach($newSheetViewFilters as $sheetViewFilter) {
        $newSheetView->filters()->create($sheetViewFilter);
      }
      // Groups
      $newSheetViewGroups = $request->input('groups');
      foreach($newSheetViewGroups as $sheetViewGroup) {
        $newSheetView->groups()->create($sheetViewGroup);
      }
      // Sorts
      $newSheetViewSorts = $request->input('sorts');
      foreach($newSheetViewSorts as $sheetViewSort) {
        $newSheetView->sorts()->create($sheetViewSort);
      }
      return response()->json($newSheetView, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public static function show(SheetView $view)
    {
      return response()->json($view, 200);
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
