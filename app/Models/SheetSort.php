<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetSort extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetSorts';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked', 'createdAt'];
  protected $fillable = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked', 'createdAt'];
}