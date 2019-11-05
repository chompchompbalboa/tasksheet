<?php

namespace App\Http\Controllers;

use App\Models\SheetNote;
use Illuminate\Http\Request;

class SheetCellNoteController extends Controller
{
    public function store(Request $request)
    {
      $newSheetNote = SheetNote::create($request->all());
      return response()->json($newSheetNote, 200);
    }

    public function destroy(SheetNote $note)
    {
      $note->delete();
      return response()->json(null, 204);
    }
}
