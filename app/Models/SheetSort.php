<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetSort extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetSorts';

  protected $visible = ['id', 'columnId', 'order'];
  protected $fillable = ['id', 'sheetId', 'viewId', 'columnId', 'order'];
}