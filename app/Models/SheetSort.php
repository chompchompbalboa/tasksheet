<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetSort extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetSorts';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked'];
  protected $fillable = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked'];
}