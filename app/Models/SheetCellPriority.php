<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetCellPriority extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetCellPriorities';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'cellId', 'priorityId'];
  protected $fillable = ['id', 'sheetId', 'cellId', 'priorityId'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }

}