<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SheetView extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;

  protected $table = 'sheetViews';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = [ 'id', 'sheetId', 'name', 'isLocked', 'visibleColumns', 'filters', 'groups', 'sorts' ];
  protected $fillable = [ 'id', 'sheetId', 'name', 'isLocked', 'visibleColumns' ];
  protected $with = [ 'filters', 'groups', 'sorts' ];
  protected $casts = [
    'visibleColumns' => 'array'
  ];
  
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetViewId')->orderBy('createdAt');
  }
  
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetViewId')->orderBy('createdAt');
  }

  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetViewId')->orderBy('createdAt');
  }
}