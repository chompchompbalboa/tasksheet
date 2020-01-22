<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FolderPermission;

class FolderPermissionController extends Controller
{
    public function store(Request $request)
    {
      $folder = FolderPermission::create($request->all());
      return response()->json($folder, 200);
    }

    public function update(Request $request, FolderPermission $permission)
    {
      $permission->update($request->all());
      return response()->json($permission, 200);
    }

    public function destroy(FolderPermission $permission)
    {
      $permission->delete();
      return response()->json(true, 200);
    }
}
