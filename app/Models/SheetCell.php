<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\SheetPhoto;

class SheetCell extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetCells';

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'columnId', 'rowId', 'value', 'style'];
  protected $fillable = ['id', 'sheetId', 'columnId', 'rowId', 'value', 'style'];
  
  public function column() {
    return $this->belongsTo('App\Models\SheetColumn', 'columnId');
  }
}