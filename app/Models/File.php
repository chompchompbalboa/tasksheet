<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'name', 'folderId', 'type', 'typeId'];
  protected $fillable = ['id', 'name', 'folderId', 'type', 'typeId'];


  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
}