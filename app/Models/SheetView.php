<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SheetView extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetViews';

  protected $visible = ['id', 'sheetId', 'name', 'filters', 'groups', 'sorts'];
  protected $fillable = ['id', 'sheetId', 'name'];
  protected $with = ['filters', 'groups', 'sorts'];
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetViewId')->orderBy('created_at');
  }
  
  /**
   * Get all the groups that belong to this table
   */
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetViewId')->orderBy('created_at');
  }
  
  /**
   * Get all the sorts that belong to this table
   */
  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetViewId')->orderBy('created_at');
  }
}