<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\FilePermission;
use App\Models\Folder;
use App\Models\FolderPermission;
use App\Models\User;

class FolderController extends Controller
{
    public function store(Request $request)
    {
      $folder = Folder::create($request->all());
      
      $newFolderPermissions = [];
      $newFolderPermissionsToReturn = [];
      if($folder->folderId !== null) {
        $folderFolderPermissions = FolderPermission::where('folderId', $folder->folderId)->get();
        foreach($folderFolderPermissions as $folderPermission) {
          $user = User::find($folderPermission->userId);
          if($user) {
            $newFolderPermissionId = Str::uuid()->toString();
            array_push($newFolderPermissions, [
              'id' => $newFolderPermissionId,
              'userId' => $user->id,
              'folderId' => $folder->id,
              'role' => $folderPermission->role
            ]);
            array_push($newFolderPermissionsToReturn, [
              'id' => $newFolderPermissionId,
              'userId' => $user->id,
              'userName' => $user->name,
              'userEmail' => $user->email,
              'folderId' => $folder->id,
              'role' => $folderPermission->role
            ]);
          }
        }
      } 
      else {
        $user = Auth::user();
        if($user) {
          $newFolderPermissionId = Str::uuid()->toString();
          array_push($newFolderPermissions, [
            'id' => $newFolderPermissionId,
            'userId' => $user->id,
            'folderId' => $folder->id,
            'role' => 'OWNER'
          ]);
          array_push($newFolderPermissionsToReturn, [
            'id' => $newFolderPermissionId,
            'userId' => $user->id,
            'userName' => $user->name,
            'userEmail' => $user->email,
            'folderId' => $folder->id,
            'role' => 'OWNER'
          ]);
        }
      }
      
      FolderPermission::insert($newFolderPermissions);
      
      return response()->json($newFolderPermissionsToReturn, 200);
    }

    public function update(Request $request, Folder $folder)
    {
      $folder->update($request->all());
      return response()->json($folder, 200);
    }

    public function destroy(Folder $folder)
    {
      // Get the folder permissions to delete
      $subfolderIds = Folder::subfolderIds($folder->id);
      $folderPermissionsToDelete = FolderPermission::whereIn('folderId', $subfolderIds)->get();
      $folderPermissionIdsToDelete = [];
      foreach($folderPermissionsToDelete as $folderPermissionToDelete) {
        $folderPermissionIdsToDelete[] = $folderPermissionToDelete->id;
      }

      // Get the file permissions to delete
      $fileIds = array_merge ( Folder::fileIds($folder->id), Folder::subfolderFileIds($folder->id) );
      $filePermissionsToDelete = FilePermission::whereIn('fileId', $fileIds)->get();
      $filePermissionIdsToDelete = [];
      foreach($filePermissionsToDelete as $filePermissionToDelete) {
        $filePermissionIdsToDelete[] = $filePermissionToDelete->id;
      }

      // Delete the permissions
      FolderPermission::destroy($folderPermissionIdsToDelete);
      FilePermission::destroy($filePermissionIdsToDelete);

      // Delete the folder
      $folder->delete();

      return response()->json(true, 200);
    }

    public function restore(string $folderId)
    {
      // Attempt to retrieve the folder
      $folder = Folder::withTrashed($folderId)
                ->where('id', $folderId)
                ->first();

      // If the folder exists
      if($folder) {

        // Get the deleted at timestamp before restoring the folder
        // We need to query the permissions models by the deleted_at timestamp
        // to ensure that we're not restoring items that were deleted prior
        // to the folder being deleted
        $deletedAt = $folder->deleted_at->toDateTimeString();

        // Restore the folder
        $folder->restore();

        // Get the folder permissions to restore
        $subfolderIds = Folder::subfolderIds($folder->id);
        $folderPermissionsToRestore = FolderPermission::withTrashed()
                                                      ->whereIn('folderId', $subfolderIds)
                                                      ->where('deleted_at', $deletedAt)
                                                      ->restore();

        // Get the file permissions to restore
        $fileIds = array_merge ( Folder::fileIds($folder->id), Folder::subfolderFileIds($folder->id) );
        $filePermissionsToRestore = FilePermission::withTrashed()
                                                  ->whereIn('fileId', $fileIds)
                                                  ->where('deleted_at', $deletedAt)
                                                  ->restore();
        return response()->json(true, 200);
      }
      return response()->json(false, 200);
    }
}
