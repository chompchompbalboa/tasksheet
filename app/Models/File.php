<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;
  public $incrementing = false;

  protected $visible = ['id', 'name', 'folderId', 'type', 'typeId'];
  protected $fillable = ['id', 'name', 'folderId', 'type', 'typeId'];

  
  /**
   * Get all the folder this file belongs to
   */
  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
}