<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetFilter extends Model
{
  use Traits\UsesUuid;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $table = 'sheetFilters';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'type', 'value', 'isLocked', 'createdAt'];
  protected $fillable = ['id', 'sheetId', 'sheetViewId', 'columnId', 'type', 'value', 'isLocked', 'createdAt'];
}