<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetPhoto extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetPhotos';

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'sheetId', 'cellId', 'filename', 'uploadedBy', 'uploadedDate'];
  protected $fillable = ['id', 'sheetId', 'cellId', 'filename', 'uploadedBy', 'uploadedDate'];
  
  public function cell() {
    return $this->belongsTo('App\Models\SheetCell', 'cellId');
  }

}