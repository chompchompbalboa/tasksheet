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

  protected $visible = ['id', 'name', 'folderId', 'folders', 'files', 'users'];
  protected $fillable = ['id', 'name', 'folderId'];
  protected $appends = ['folders', 'files', 'users'];

  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
  
  public function folders() {
    return $this->hasMany('App\Models\Folder', 'folderId');
  }
  public function getFoldersAttribute() {
    return $this->folders()->orderBy('name')->get();
  }
  
  public function getUsersAttribute() {
    $users = [];
    $usersToGet = [];
    $userRoles = [];
    $folderPermissions = FolderPermission::where('folderId', $this->id)->get();
    foreach($folderPermissions as $folderPermission) {
      array_push($usersToGet, $folderPermission->userId);
      $userRoles[$folderPermission->userId] = $folderPermission->role;
    }
    $usersWithPermission = User::whereIn('id', $usersToGet)->get();
    foreach($usersWithPermission as $user) {
      array_push($users, [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $userRoles[$user->id]
      ]);
    }
    return $users;
  }
  
  public function files() {
    return $this->hasMany('App\Models\File', 'folderId');
  }
  public function getFilesAttribute() {
    return $this->files()->orderBy('name')->get();
  }
}