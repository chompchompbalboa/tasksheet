<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetColumn extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetColumns';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'name', 'width', 'cellType', 'defaultValue'];
  protected $fillable = ['id', 'sheetId', 'name', 'width', 'cellType', 'defaultValue'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
}