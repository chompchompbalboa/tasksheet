<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\File;

class FileController extends Controller
{
    public function store(Request $request)
    {
      $file = File::create($request->all());
      return response()->json(true, 200);
    }

    public function update(Request $request, File $file)
    {
      $file->update($request->all());
      return response()->json(true, 200);
    }

    public function destroy(File $file)
    {
      $file->delete();
      return response()->json(true, 200);
    }

    public function restore(string $fileId)
    {
      $file = File::withTrashed($fileId)
                ->where('id', $fileId)
                ->first();
      if($file) {
        $file->restore();
        return response()->json(true, 200);
      }
      return response()->json(false, 200);
    }
}
