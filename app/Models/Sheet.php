<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet extends Model
{
  use Traits\UsesUuid;

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'rows', 'columns', 'filters', 'sorts'];
  protected $fillable = ['id'];
  protected $with = ['rows', 'filters', 'sorts'];
  protected $appends = ['columns'];
  
  /**
   * Get all the columns that belong to this table
   */
  public function columns() {
    return $this->hasMany('App\Models\SheetColumn', 'sheetId');
  }
  public function getColumnsAttribute() {
    return SheetColumn::where('sheetId', '=', $this->id)
    ->orderBy('position', 'ASC')
    ->get();
  }
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetId');
  }
  
  /**
   * Get all the rows that belong to this table
   */
  public function rows() {
    return $this->hasMany('App\Models\SheetRow', 'sheetId');
  }
  
  /**
   * Get all the sorts that belong to this table
   */
  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetId');
  }
}