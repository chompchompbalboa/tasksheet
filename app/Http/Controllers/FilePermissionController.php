<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FilePermission;
use App\Models\User;

class FilePermissionController extends Controller
{
    public function store(Request $request)
    {
      // Get the request variables
      $fileId = $request->input('fileId');
      $email = $request->input('email');
      $role = $request->input('role');
      
      // Return a 404 if we can't find a user with that email
      $user = User::where('email', $email)->firstOrFail();
      
      // Return a 400 if the user already has permission to the folder and its files
      $doesUserAlreadyHaveFilePermission = FilePermission::where('userId', $user->id)->where('fileId', $fileId)->count() > 0;
      if($doesUserAlreadyHaveFilePermission) {
        return response(null, 400);
      }
      else {
        $newFilePermission = FilePermission::create([
          'userId' => $user->id,
          'fileId' => $fileId,
          'role' => $role
        ]);
        return response()->json([[ 
          'userId' => $user->id,
          'userName' => $user->name,
          'userEmail' => $user->email,
          'fileId' => $fileId,
          'role' => $role
        ]], 200);
      }
    }

    public function update(Request $request, FilePermission $permission)
    {
      $permission->update($request->all());
      return response(null, 200);
    }

    public function destroy(FilePermission $permission)
    {
      $permissionId = $permission->id;
      $permission->delete();
      return response()->json([ $permissionId ], 200);
    }
}
