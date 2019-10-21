<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet extends Model
{
  use Traits\UsesUuid;

  /**
   * Define which attributes will be visible
   */
  protected $visible = ['id', 'sourceSheetId', 'fileType', 'activeSheetViewId', 'rows', 'columns', 'filters', 'groups', 'sorts', 'views', 'styles', 'visibleColumns', 'defaultVisibleRows', 'sourceSheetDefaultVisibleRows'];
  protected $fillable = ['id', 'sourceSheetId', 'activeSheetViewId', 'visibleColumns', 'defaultVisibleRows'];
  protected $with = ['filters', 'groups', 'sorts', 'views'];
  protected $appends = ['columns', 'rows', 'fileType', 'sourceSheetDefaultVisibleRows', 'styles'];
  protected $casts = [
    'defaultVisibleRows' => 'array',
    'visibleColumns' => 'array'
  ];
  
  public function getFileTypeAttribute() {
    return "SHEET";
  }
  
  /**
   * Get all the columns that belong to this table
   */
  public function getColumnsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    return SheetColumn::where('sheetId', '=', $sheetId)
    ->orderBy('created_at', 'ASC')
    ->get();
  }
  
  /**
   * Get all the filters that belong to this table
   */
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetId')->orderBy('created_at');
  }
  
  /**
   * Get all the groups that belong to this table
   */
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetId')->orderBy('created_at');
  }
  
  /**
   * Get all the rows that belong to this table
   */
  public function getRowsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    $rows = SheetRow::where('sheetId', '=', $sheetId)
    ->get();
    return $rows;
  }
  
  /**
   * Get all the sorts that belong to this table
   */
  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetId')->orderBy('created_at');
  }
  
  /**
   * Get all the rows that belong to this table
   */
  public function getSourceSheetDefaultVisibleRowsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    $sheet = Sheet::find($sheetId);
    return $sheet->defaultVisibleRows;
  }
  
  /**
   * Get all the styles that belong to this table
   */
  public function getStylesAttribute() {
    return SheetStyles::where('sheetId', '=', $this->id)->first();
  }
  
  /**
   * Get all the views this sheet belongs to
   */
  public function views() {
    return $this->hasMany('App\Models\SheetView', 'sheetId')->orderBy('created_at');
  }
}