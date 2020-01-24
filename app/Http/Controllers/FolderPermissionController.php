<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Folder;
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
      else { // Create the new folder permissions        
        $newFolderPermissionsFolderIds = array_merge( [ $folderId ], $this->getSubfolderIds($folderId));
        $newFolderPermissions = [];
        $newFolderPermissionsToReturn = [];

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
        
        FolderPermission::insert($newFolderPermissions);
        
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
      $subfolderIds = $this->getSubfolderIds($permission->folderId);
      $permissionIdsToDelete = [ $permission->id ];
      foreach($subfolderIds as $subfolderId) {
        $permissionToDelete = FolderPermission::where('folderId', $subfolderId)->where('userId', $user->id)->first();
        if($permissionToDelete) {
          $permissionIdsToDelete[] = $permissionToDelete->id;
        }
      }
      FolderPermission::destroy($permissionIdsToDelete);
      return response()->json($permissionIdsToDelete, 200);
    }
  
    private function getSubfolderIds(string $folderId) {
      $subfolderIds = [];
        
      $fetchSubfolderIds = function ($folderId) use(&$fetchSubfolderIds, &$subfolderIds) {
        $subfolders = Folder::where('folderId', $folderId)->get();
        foreach($subfolders as $subfolder) {
          $subfolderIds[] = $subfolder->id;
          $fetchSubfolderIds($subfolder->id);
        }
      };

      $fetchSubfolderIds($folderId);
      return $subfolderIds;
    }
}
