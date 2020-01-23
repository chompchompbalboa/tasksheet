<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Folder;
use App\Models\FolderPermission;

class FolderController extends Controller
{
    public function store(Request $request)
    {
      $folder = Folder::create($request->all());
      $newFolderPermissions = [];
      $folderFolderPermissions = FolderPermission::where('folderId', $folder->folderId)->get();
      foreach($folderFolderPermissions as $folderPermission) {
        array_push($newFolderPermissions, [
          'id' => Str::uuid()->toString(),
          'userId' => $folderPermission->userId,
          'folderId' => $folder->id,
          'role' => $folderPermission->role
        ]);
      }
      FolderPermission::insert($newFolderPermissions);
      return response()->json($folder, 200);
    }

    public function update(Request $request, Folder $folder)
    {
      $folder->update($request->all());
      return response()->json($folder, 200);
    }

    public function destroy(Folder $folder)
    {
      $folder->delete();
      return response()->json(true, 200);
    }

    public function restore(string $folderId)
    {
      $folder = Folder::withTrashed($folderId)
                ->where('id', $folderId)
                ->first();
      if($folder) {
        $folder->restore();
        return response()->json(true, 200);
      }
      return response()->json(false, 200);
    }
}
