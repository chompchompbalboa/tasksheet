<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\FilePermission;
use App\Models\User;

class File extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'name', 'folderId', 'userId', 'type', 'typeId', 'permissions'];
  protected $fillable = ['id', 'name', 'folderId', 'userId', 'type', 'typeId'];
  protected $appends = ['permissions'];
  
  public function getPermissionsAttribute() {
    $permissions = [];
    $usersToGet = [];
    $userPermissions = [];
    $filePermissions = FilePermission::where('fileId', $this->id)->get();
    foreach($filePermissions as $filePermission) {
      array_push($usersToGet, $filePermission->userId);
      $userPermissions[$filePermission->userId] = [
        'id' => $filePermission->id,
        'role' => $filePermission->role
      ];
    }
    $usersWithPermission = User::whereIn('id', $usersToGet)->get();
    foreach($usersWithPermission as $user) {
      array_push($permissions, [
        'id' => $userPermissions[$user->id]['id'],
        'fileId' => $this->id,
        'userId' => $user->id,
        'userName' => $user->name,
        'userEmail' => $user->email,
        'role' => $userPermissions[$user->id]['role']
      ]);
    }
    return $permissions;
  }
}