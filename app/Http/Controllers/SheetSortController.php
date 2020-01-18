<?php

namespace App\Http\Controllers;

use App\Models\SheetSort;
use Illuminate\Http\Request;

class SheetSortController extends Controller
{
    public function store(Request $request)
    {
      $sheetSort = SheetSort::create($request->all());
      return response()->json($sheetSort, 200);
    }

    public function update(Request $request, SheetSort $sort)
    {
      $sort->update($request->all());
      return response()->json($sort, 200);
    }

    public function destroy(SheetSort $sort)
    {
      $sort->delete();
      return response()->json(null, 204);
    }

    public function restore(string $sortId)
    {
      $sort = SheetSort::withTrashed()->where('id', $sortId)->first();
      if($sort) {
        $sort->restore();
        return response()->json(true, 200);
      }
      return response()->json(false, 404);
    }
}
