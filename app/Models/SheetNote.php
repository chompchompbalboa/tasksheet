<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetNote extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetNotes';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'cellId', 'value', 'createdBy', 'createdAt'];
  protected $fillable = ['id', 'sheetId', 'cellId', 'value', 'createdBy', 'createdAt'];
  
  public function sheet() {
    return $this->belongsTo('App\Models\Sheet', 'sheetId');
  }
  
  public function cell() {
    return $this->belongsTo('App\Models\SheetCell', 'cellId');
  }

}