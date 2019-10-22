<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetFilter extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetFilters';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'type', 'value', 'isLocked'];
  protected $fillable = ['id', 'created_at', 'sheetId', 'sheetViewId', 'columnId', 'type', 'value', 'isLocked'];
}