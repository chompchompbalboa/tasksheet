<?php

namespace App\Http\Controllers;

use App\Models\SheetGroup;
use Illuminate\Http\Request;

class SheetGroupController extends Controller
{
    public function store(Request $request)
    {
      $sheetGroup = SheetGroup::create($request->all());
      return response()->json($sheetGroup, 200);
    }

    public function update(Request $request, SheetGroup $group)
    {
      $group->update($request->all());
      return response()->json($group, 200);
    }

    public function destroy(SheetGroup $group)
    {
      $group->delete();
      return response()->json(null, 204);
    }
}
