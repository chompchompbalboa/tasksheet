<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetView extends Model
{
  use Traits\UsesUuid;

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'sheets', 'filters', 'groups', 'sorts'];
  protected $fillable = ['id'];
  protected $with = ['sheets', 'filters', 'groups', 'sorts'];
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetId');
  }
  
  /**
   * Get all the groups that belong to this table
   */
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetId');
  }
  
  /**
   * Get all the sheets that belong to this table
   */
  public function sheets() {
    return $this->belongsToMany('App\Models\Sheet', 'sheetViewSheets', 'sheetViewId', 'sheetId');
  }
  
  /**
   * Get all the sorts that belong to this table
   */
  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetId');
  }
}