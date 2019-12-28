<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\SheetPhoto;

class SheetCell extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetCells';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'columnId', 'rowId', 'value'];
  protected $fillable = ['id', 'sheetId', 'columnId', 'rowId', 'value'];
  
  public function column() {
    return $this->belongsTo('App\Models\SheetColumn', 'columnId');
  }
}