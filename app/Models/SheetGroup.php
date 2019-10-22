<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetGroup extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetGroups';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked'];
  protected $fillable = ['id', 'created_at', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked'];
}