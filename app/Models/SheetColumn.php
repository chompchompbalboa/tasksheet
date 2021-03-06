<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetColumn extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetColumns';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = [
    'id', 
    'sheetId', 
    'name', 
    'width', 
    'cellType', 
    'defaultValue', 
    'trackCellChanges', 
    'showCellChanges'
  ];

  protected $fillable = [
    'id', 
    'sheetId', 
    'name', 
    'width', 
    'cellType', 
    'defaultValue', 
    'trackCellChanges', 
    'showCellChanges'
  ];

  protected $casts = [
    'trackCellChanges' => 'boolean',
    'showCellChanges' => 'boolean'
  ];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
}