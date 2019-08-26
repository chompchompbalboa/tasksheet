<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetCell extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetCells';

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'columnId', 'rowId', 'value'];
  protected $fillable = ['id', 'sheetId', 'columnId', 'rowId', 'value'];
  
  public function column() {
    return $this->belongsTo('App\Models\SheetColumn', 'columnId');
  }

}