<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FilePermission extends Model
{
  use Traits\UsesUuid;

  protected $table = 'filePermissions';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'userId', 'fileId', 'role'];
  protected $fillable = ['id', 'userId', 'fileId', 'role'];
}