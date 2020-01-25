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
      
      // Return a 400 if the user already has permission to the folder
      $doesUserAlreadyHaveFolderPermission = FolderPermission::where('userId', $user->id)->where('folderId', $folderId)->count() > 0;
      if($doesUserAlreadyHaveFolderPermission) {
        return response(null, 400);
      }
      // Otherwise, create the folder and file permissions
      else {
        // Get all of the subfolders we'll need to add permission to
        $newFolderPermissionsFolderIds = array_diff(
          array_merge( [ $folderId ], Folder::subfolderIds($folderId) ), // All of the possible folderIds to add
          $user->folderIds() // Remove the folderIds the user already has permission to
        );

        // Add a new permission for each folder
        $newFolderPermissions = [];
        $newFolderPermissionsToReturn = []; // We need to add userName and userEmail to the returned folder permissions
        foreach($newFolderPermissionsFolderIds as $newFolderPermissionsFolderId) {
          $newFolderPermissionId = Str::uuid()->toString();
          array_push($newFolderPermissions, [
            'id' => $newFolderPermissionId,
            'folderId' => $newFolderPermissionsFolderId,
            'userId' => $user->id,
            'role' => $role
          ]);
          array_push($newFolderPermissionsToReturn, [
            'id' => $newFolderPermissionId,
            'folderId' => $newFolderPermissionsFolderId,
            'userId' => $user->id,
            'userName' => $user->name,
            'userEmail' => $user->email,
            'role' => $role
          ]);
        }
        
        // Get all of the files we'll need to add to permission to
        $newFilePermissionFileIds = array_diff(
          array_merge( Folder::fileIds($folderId), Folder::subfolderFileIds($folderId) ), // All of the possible fileIds to add
          $user->fileIds() // Remove the fileIds the user already has permission to
        );
        
        // Add a new permission for each file
        $newFilePermissions = [];
        $newFilePermissionsToReturn = []; // We need to add userName and userEmail to the returned file permissions
        foreach($newFilePermissionFileIds as $newFilePermissionFileId) {
          $newFilePermissionId = Str::uuid()->toString();
          array_push($newFilePermissions, [
            'id' => $newFilePermissionId,
            'fileId' => $newFilePermissionFileId,
            'userId' => $user->id,
            'role' => $role
          ]);
          array_push($newFilePermissionsToReturn, [
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
        return response()->json([
          'folderPermissions' => $newFolderPermissionsToReturn,
          'filePermissions' => $newFilePermissionsToReturn
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
      // Return a 404 if the user can't be found
      $user = User::where('id', $permission->userId)->firstOrFail();

      // Get the folder permissions to delete
      $subfolderIds = Folder::subfolderIds($permission->folderId);
      $folderPermissionsToDelete = FolderPermission::where('userId', $user->id)->whereIn('folderId', $subfolderIds)->get();
      $folderPermissionIdsToDelete = [ $permission->id ];
      foreach($folderPermissionsToDelete as $folderPermissionToDelete) {
        $folderPermissionIdsToDelete[] = $folderPermissionToDelete->id;
      }

      // Get the file permissions to delete
      $fileIds = array_merge ( Folder::fileIds($permission->folderId), Folder::subfolderFileIds($permission->folderId) );
      $filePermissionsToDelete = FilePermission::where('userId', $user->id)->whereIn('fileId', $fileIds)->get();
      $filePermissionIdsToDelete = [];
      foreach($filePermissionsToDelete as $filePermissionToDelete) {
        $filePermissionIdsToDelete[] = $filePermissionToDelete->id;
      }

      // Delete the permissions
      FolderPermission::destroy($folderPermissionIdsToDelete);
      FilePermission::destroy($filePermissionIdsToDelete);

      return response()->json([
        'deletedFolderPermissionIds' => $folderPermissionIdsToDelete,
        'deletedFilePermissionIds' => $filePermissionIdsToDelete
      ], 200);
    }
}
