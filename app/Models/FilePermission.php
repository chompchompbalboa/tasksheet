<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class FilePermission extends Pivot
{
  use Traits\UsesUuid;

  protected $table = 'filePermissions';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'userId', 'fileId', 'role'];
  protected $fillable = ['id', 'userId', 'fileId', 'role'];
}