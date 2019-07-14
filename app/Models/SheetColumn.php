<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetColumn extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetColumns';

  protected $visible = ['id', 'sheetId', 'name', 'position', 'width', 'type'];
  protected $fillable = ['id', 'sheetId', 'name', 'position', 'width', 'type'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
}