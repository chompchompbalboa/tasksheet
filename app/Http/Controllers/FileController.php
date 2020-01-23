<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\File;
use App\Models\FilePermission;
use App\Models\FolderPermission;

class FileController extends Controller
{
    public function store(Request $request)
    {
      $file = File::create($request->all());
      $newFilePermissions = [];
      if(!is_null($file->folderId)) {
        $fileFolderPermissions = FolderPermission::where('folderId', $file->folderId)->get();
        foreach($fileFolderPermissions as $folderPermission) {
          array_push($newFilePermissions, [
            'id' => Str::uuid()->toString(),
            'userId' => $folderPermission->userId,
            'fileId' => $file->id,
            'role' => $folderPermission->role
          ]);
        }
      }
      if(!is_null($file->userId)) {
        $user = Auth::user();
        array_push($newFilePermissions, [
          'id' => Str::uuid()->toString(),
          'userId' => $user->id,
          'fileId' => $file->id,
          'role' => 'OWNER'
        ]);
      }
      FilePermission::insert($newFilePermissions);
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
