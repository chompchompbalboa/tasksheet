<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetGroup extends Model
{
  use Traits\UsesUuid;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $table = 'sheetGroups';

  protected $visible = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked', 'createdAt'];
  protected $fillable = ['id', 'sheetId', 'sheetViewId', 'columnId', 'order', 'isLocked', 'createdAt'];
}