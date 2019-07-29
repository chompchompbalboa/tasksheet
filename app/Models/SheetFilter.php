<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetFilter extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetFilters';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'type', 'value'];
  protected $fillable = ['id', 'sheetId', 'sheetViewId', 'columnId', 'type', 'value'];
}