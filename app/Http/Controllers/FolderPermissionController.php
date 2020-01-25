<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\FilePermission;
use App\Models\Folder;
use App\Models\FolderPermission;
use App\Models\User;

class FolderPermissionController extends Controller
{
    public function store(Request $request)
    {
      // Get the request variables
      $folderId = $request->input('folderId');
      $email = $request->input('email');
      $role = $request->input('role');
      
      // Return a 404 if we can't find a user with that email
      $user = User::where('email', $email)->firstOrFail(); 
      
      // Return a 400 if the user already has permission to the folder and its files
      $doesUserAlreadyHaveFolderPermission = FolderPermission::where('userId', $user->id)->where('folderId', $folderId)->count() > 0;
      $doesUserAlreadyHaveFilePermissions = true;
      if($doesUserAlreadyHaveFolderPermission && $doesUserAlreadyHaveFilePermissions) {
        return response(null, 400);
      }
      // Otherwise, create the folder and file permissions
      else {    
        // Get all of the subfolders we'll need to add permission to
        $newFolderPermissionsFolderIds = array_merge( [ $folderId ], Folder::subfolderIds($folderId) );
        $newFolderPermissions = [];
        $newFolderPermissionsToReturn = [];

        // Add a new permission for each folder
        foreach($newFolderPermissionsFolderIds as $newFolderPermissionsFolderId) {
          $newFolderPermissionId = Str::uuid()->toString();
          array_push($newFolderPermissions, [
            'id' => $newFolderPermissionId,
            'folderId' => $newFolderPermissionsFolderId,
            'userId' => $user->id,
            'role' => $role
          ]);
          array_push($newFolderPermissionsToReturn, [ // The return array is slightly different to prevent having to refetch userName and userEmail
            'id' => $newFolderPermissionId,
            'folderId' => $newFolderPermissionsFolderId,
            'userId' => $user->id,
            'userName' => $user->name,
            'userEmail' => $user->email,
            'role' => $role
          ]);
        }
        
        // Get all of the files we'll need to add to permission to
        $newFilePermissionFileIds = array_merge( Folder::fileIds($folderId), Folder::subfolderFileIds($folderId) );
        $newFilePermissions = [];
        $newFilePermissionsToReturn = [];
        
        // Add a new permission for each file
        foreach($newFilePermissionFileIds as $newFilePermissionFileId) {
          $newFilePermissionId = Str::uuid()->toString();
          array_push($newFilePermissions, [
            'id' => $newFilePermissionId,
            'fileId' => $newFilePermissionFileId,
            'userId' => $user->id,
            'role' => $role
          ]);
          array_push($newFilePermissionsToReturn, [ // The return array is slightly different to prevent having to refetch userName and userEmail
            'id' => $newFilePermissionId,
            'fileId' => $newFilePermissionFileId,
            'userId' => $user->id,
            'userName' => $user->name,
            'userEmail' => $user->email,
            'role' => $role
          ]);
        }
        
        // Insert the new permissions
        FolderPermission::insert($newFolderPermissions);
        FilePermission::insert($newFilePermissions);
        
        // Return 200
        return response()->json($newFolderPermissionsToReturn, 200);
      }
    }

    public function update(Request $request, FolderPermission $permission)
    {
      $permission->update($request->all());
      return response()->json($permission, 200);
    }

    public function destroy(FolderPermission $permission)
    {
      $user = User::where('id', $permission->userId)->firstOrFail(); // Return a 404 if the user can't be found
      $subfolderIds = Folder::subfolderIds($permission->folderId);
      $permissionIdsToDelete = [ $permission->id ];
      $permissionsToDelete = FolderPermission::where('userId', $user->id)->whereIn('folderId', $subfolderIds)->get();
      foreach($permissionsToDelete as $permissionToDelete) {
        $permissionIdsToDelete[] = $permissionToDelete->id;
      }
      FolderPermission::destroy($permissionIdsToDelete);
      return response()->json($permissionIdsToDelete, 200);
    }
}
