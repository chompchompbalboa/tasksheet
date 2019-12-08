<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetCellFile extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetCellFiles';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'cellId', 'filename', 's3Uuid', 's3Bucket', 's3Key', 'uploadedBy', 'uploadedAt'];
  protected $fillable = ['id', 'sheetId', 'cellId', 'filename', 's3Uuid', 's3Bucket', 's3Key', 'uploadedBy', 'uploadedAt'];
  
  public function cell() {
    return $this->belongsTo('App\Models\SheetCell', 'cellId');
  }

}