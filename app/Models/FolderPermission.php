<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class FolderPermission extends Pivot
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'folderPermissions';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'userId', 'folderId', 'role'];
  protected $fillable = ['id', 'userId', 'folderId', 'role'];
}