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
}
