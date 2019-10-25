<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetFile extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetFiles';

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'sheetId', 'cellId', 'filename', 's3Uuid', 's3Bucket', 's3Key', 'uploadedBy', 'uploadedAt'];
  protected $fillable = ['id', 'sheetId', 'cellId', 'filename', 's3Uuid', 's3Bucket', 's3Key', 'uploadedBy', 'uploadedAt'];
  
  public function cell() {
    return $this->belongsTo('App\Models\SheetCell', 'cellId');
  }

}