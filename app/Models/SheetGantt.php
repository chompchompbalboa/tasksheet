<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetGantt extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetGantts';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'columnId', 'startDate', 'endDate'];
  protected $fillable = ['id', 'sheetId', 'columnId', 'startDate', 'endDate'];
  protected $dates = [
    'startDate',
    'endDate'
  ];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
  public function column() {
    return $this->belongsTo('App\Models\SheetColumn', 'columnId');
  }

}