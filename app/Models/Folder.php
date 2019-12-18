<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Folder extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $appends = ['folders', 'files'];
  protected $fillable = ['id', 'name', 'folderId'];
  protected $visible = ['id', 'name', 'folderId', 'folders', 'files'];

  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
  
  public function folders() {
    return $this->hasMany('App\Models\Folder', 'folderId');
  }
  public function getFoldersAttribute() {
    return $this->folders()->orderBy('name')->get();
  }
  
  public function files() {
    return $this->hasMany('App\Models\File', 'folderId');
  }
  public function getFilesAttribute() {
    return $this->files()->orderBy('name')->get();
  }
}