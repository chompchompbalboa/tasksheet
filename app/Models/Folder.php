<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\FolderPermission;
use App\Models\User;

class Folder extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'name', 'folderId', 'permissions'];
  protected $fillable = ['id', 'name', 'folderId'];
  protected $appends = ['permissions'];
  
  // File Ids
  public static function fileIds(string $folderId) {
    $fileIds = [];
    $files = File::where('folderId', $folderId)->get();
    foreach($files as $file) {
      $fileIds[] = $file->id;
    }
    return $fileIds;
  }
  
  // Permissions
  public function getPermissionsAttribute() {
    $permissions = [];
    $usersToGet = [];
    $userPermissions = [];
    $folderPermissions = FolderPermission::where('folderId', $this->id)->get();
    foreach($folderPermissions as $folderPermission) {
      array_push($usersToGet, $folderPermission->userId);
      $userPermissions[$folderPermission->userId] = [
        'id' => $folderPermission->id,
        'role' => $folderPermission->role
      ];
    }
    $usersWithPermission = User::whereIn('id', $usersToGet)->get();
    foreach($usersWithPermission as $user) {
      array_push($permissions, [
        'id' => $userPermissions[$user->id]['id'],
        'folderId' => $this->id,
        'userId' => $user->id,
        'userName' => $user->name,
        'userEmail' => $user->email,
        'role' => $userPermissions[$user->id]['role']
      ]);
    }
    return $permissions;
  }
  
  // Subfolder Ids
  public static function subfolderIds(string $parentFolderId) {
    $subfolderIds = [];
    $fetchSubfolderIds = function ($folderId) use(&$fetchSubfolderIds, &$subfolderIds) {
      $subfolders = self::where('folderId', $folderId)->get();
      foreach($subfolders as $subfolder) {
        $subfolderIds[] = $subfolder->id;
        $fetchSubfolderIds($subfolder->id);
      }
    };
    $fetchSubfolderIds($parentFolderId);
    return $subfolderIds;
  }
  
  // Subfolder File Ids
  public static function subfolderFileIds(string $folderId) {
    $fileIds = [];
    $fetchSubfolderFileIds = function ($folderId) use(&$fetchSubfolderFileIds, &$fileIds) {
      $subfolders = self::where('folderId', $folderId)->get();
      foreach($subfolders as $subfolder) {
        $subfolderFiles = File::where('folderId', $subfolder->id)->get();
        foreach($subfolderFiles as $subfolderFile) {
          $fileIds[] = $subfolderFile->id;
        }
        $fetchSubfolderFileIds($subfolder->id);
      }
    };
    $fetchSubfolderFileIds($folderId);
    return $fileIds;
  }
  
}