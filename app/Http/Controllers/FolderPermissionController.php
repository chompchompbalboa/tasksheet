<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FolderPermission;
use App\Models\User;

class FolderPermissionController extends Controller
{
    public function store(Request $request)
    {
      $folderId = $request->input('folderId');
      $email = $request->input('email');
      $role = $request->input('role');
      
      $user = User::where('email', $email)->firstOrFail(); // Return a 404 if we can't find a user with that email
      $doesUserAlreadyHavePermission = FolderPermission::where('userId', $user->id)->where('folderId', $folderId)->count() > 0; // Make sure that user doesn't already have access to that folder
      if($doesUserAlreadyHavePermission) {
        return response(null, 400);
      }
      else {
        $folderPermission = FolderPermission::create([
          'folderId' => $folderId,
          'userId' => $user->id,
          'userName' => $user->name,
          'userEmail' => $user->email,
          'role' => $role
        ]);
        return response()->json([
          'id' => $folderPermission->id,
          'folderId' => $folderPermission->folderId,
          'userId' => $user->id,
          'userName' => $user->name,
          'userEmail' => $user->email,
          'role' => $folderPermission->role,
        ], 200);
      }
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
