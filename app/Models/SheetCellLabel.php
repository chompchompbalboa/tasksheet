<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetCellLabel extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetCellLabels';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'columnId', 'rowId', 'cellId', 'value'];
  protected $fillable = ['id', 'sheetId', 'columnId', 'rowId', 'cellId', 'value'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
  public function cell() {
    return $this->belongsTo('App\Models\SheetCell', 'cellId');
  }

}