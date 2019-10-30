<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Folder;

class FolderController extends Controller
{
    public function store(Request $request)
    {
      $folder = Folder::create($request->all());
      return response()->json($folder, 200);
    }

    public function update(Request $request, Folder $folder)
    {
      $folder->update($request->all());
      return response()->json($folder, 200);
    }
}
