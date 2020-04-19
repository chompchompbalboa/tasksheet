<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class FilePermission extends Pivot
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'filePermissions';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'userId', 'fileId', 'role'];
  protected $fillable = ['id', 'userId', 'fileId', 'role'];
}