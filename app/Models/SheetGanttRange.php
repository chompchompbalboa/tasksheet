<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetGanttRange extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetGanttRanges';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'columnId', 'sheetGanttId', 'startDateColumnId', 'endDateColumnId', 'backgroundColor'];
  protected $fillable = ['id', 'sheetId', 'columnId', 'sheetGanttId', 'startDateColumnId', 'endDateColumnId', 'backgroundColor'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
  public function column() {
    return $this->belongsTo('App\Models\SheetColumn', 'columnId');
  }

}