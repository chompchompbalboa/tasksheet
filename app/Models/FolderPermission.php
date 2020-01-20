<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FolderPermission extends Model
{
  use Traits\UsesUuid;

  protected $table = 'folderPermissions';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'userId', 'folderId', 'role'];
  protected $fillable = ['id', 'userId', 'folderId', 'role'];
}