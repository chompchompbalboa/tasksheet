<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetRow extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetRows';

  protected $visible = ['id', 'sheetId', 'cells'];
  protected $fillable = ['id', 'sheetId'];
  protected $with = ['cells'];
  
  public function cells() {
    return $this->hasMany('App\Models\SheetCell', 'rowId');
  }
}