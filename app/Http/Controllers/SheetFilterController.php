<?php

namespace App\Http\Controllers;

use App\Models\SheetFilter;
use Illuminate\Http\Request;

class SheetFilterController extends Controller
{
    public function store(Request $request)
    {
      $sheetFilter = SheetFilter::create($request->all());
      return response()->json($sheetFilter, 200);
    }

    public function destroy(SheetFilter $filter)
    {
      $filter->delete();
      return response()->json(null, 204);
    }
}
