<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetPriority extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetPriorities';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'name', 'backgroundColor', 'color', 'order', 'createdAt'];
  protected $fillable = ['id', 'sheetId', 'name', 'backgroundColor', 'color', 'order', 'createdAt'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }

}