<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetFilter;
use App\Models\SheetGroup;
use App\Models\SheetSort;
use App\Models\SheetView;

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
      $sheetId = $request->input('sheetId');
      $newSheetView = SheetView::create([ 
        'id' => $request->input('id'), 
        'sheetId' => $request->input('sheetId'),
        'name' => $request->input('name'),
      ]);
      // Delete the sheet's filters, groups and sorts - since they now
      // belong to the sheet view instead
      SheetFilter::where('sheetId', $sheetId)->delete();
      SheetGroup::where('sheetId', $sheetId)->delete();
      SheetSort::where('sheetId', $sheetId)->delete();
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetView $view)
    {
      $view->update($request->all());
      return response()->json(null, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SheetView  $view
     * @return \Illuminate\Http\Response
     */
    public function destroy(SheetView $view)
    {
      SheetFilter::where('sheetViewId', $view->id)->delete();
      SheetGroup::where('sheetViewId', $view->id)->delete();
      SheetSort::where('sheetViewId', $view->id)->delete();
      $view->delete();
      return response()->json(null, 204);
    }
}
