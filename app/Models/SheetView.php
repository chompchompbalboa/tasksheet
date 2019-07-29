<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SheetView extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetViews';

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'fileType', 'columns', 'rows', 'filters', 'groups', 'sorts'];
  protected $fillable = ['id'];
  protected $with = ['filters', 'groups', 'sorts'];
  protected $appends = ['columns', 'rows', 'fileType'];
  
  public function getFileTypeAttribute() {
    return "SHEET_VIEW";
  }
  
  public function getColumnsAttribute() {
    $sheets = $this->sheets()->get();
    $columns = new Collection;
    foreach($sheets as $sheet) {
      $columns = $columns->merge($sheet->columns);
    }
    return $columns->values()->all();
  }
  
  public function getRowsAttribute() {
    $sheets = $this->sheets()->get();
    $rows = new Collection;
    foreach($sheets as $sheet) {
      $rows = $rows->merge($sheet->rows);
    }
    return $rows->values()->all();
  }
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetViewId');
  }
  
  /**
   * Get all the groups that belong to this table
   */
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetViewId');
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
    return $this->hasMany('App\Models\SheetSort', 'sheetViewId');
  }
}