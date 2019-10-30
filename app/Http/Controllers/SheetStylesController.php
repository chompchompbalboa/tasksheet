<?php

namespace App\Http\Controllers;

use App\Models\SheetStyles;
use Illuminate\Http\Request;

class SheetStylesController extends Controller
{
    public function update(Request $request, $id)
    {
      $styles = SheetStyles::find($id);
      $styles->update($request->all());
      return response()->json(null, 200);
    }
}
