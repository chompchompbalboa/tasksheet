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

    public function restore(string $filterId)
    {
      $filter = SheetFilter::withTrashed()->where('id', $filterId)->first();
      if($filter) {
        $filter->restore();
        return response()->json(true, 200);
      }
      return response()->json(false, 404);
    }
}
