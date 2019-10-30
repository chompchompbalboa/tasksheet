<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SheetView extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetViews';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sheetId', 'name', 'filters', 'groups', 'sorts'];
  protected $fillable = ['id', 'sheetId', 'name'];
  protected $with = ['filters', 'groups', 'sorts'];
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetViewId')->orderBy('createdAt');
  }
  
  /**
   * Get all the groups that belong to this table
   */
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetViewId')->orderBy('createdAt');
  }
  
  /**
   * Get all the sorts that belong to this table
   */
  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetViewId')->orderBy('createdAt');
  }
}