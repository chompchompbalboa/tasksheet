<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetColumn extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetColumns';

  protected $visible = ['id', 'name', 'width', 'typeId'];
  protected $fillable = ['id', 'sheetId', 'name', 'width', 'typeId'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
}