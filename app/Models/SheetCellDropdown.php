<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetCellDropdown extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetCellDropdowns';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = [ 'id', 'sheetId', 'cellId', 'value' ];
  protected $fillable = [ 'id', 'sheetId', 'cellId', 'value' ];
}