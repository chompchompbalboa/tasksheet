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

  protected $visible = ['id', 'name', 'folderId', 'folders', 'files', 'permissions'];
  protected $fillable = ['id', 'name', 'folderId'];
  protected $appends = ['folders', 'files', 'permissions'];

  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
  
  public function folders() {
    return $this->hasMany('App\Models\Folder', 'folderId');
  }
  public function getFoldersAttribute() {
    return $this->folders()->orderBy('name')->get();
  }
  
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
  
  public function files() {
    return $this->hasMany('App\Models\File', 'folderId');
  }
  public function getFilesAttribute() {
    return $this->files()->orderBy('name')->get();
  }
}