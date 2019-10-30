<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetSort extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetSorts';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked'];
  protected $fillable = ['id', 'created_at', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked'];
}