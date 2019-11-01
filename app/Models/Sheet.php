<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet extends Model
{
  use Traits\UsesUuid;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sourceSheetId', 'activeSheetViewId', 'defaultSheetViewId', 'rows', 'columns', 'filters', 'groups', 'sorts', 'views', 'styles', 'visibleColumns'];
  protected $fillable = ['id', 'sourceSheetId', 'activeSheetViewId', 'defaultSheetViewId'];
  protected $with = ['filters', 'groups', 'sorts', 'views'];
  protected $appends = ['columns', 'rows', 'styles'];
  protected $casts = [
    'visibleColumns' => 'array'
  ];
  
  public function getColumnsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    return SheetColumn::where('sheetId', '=', $sheetId)
    ->orderBy('createdAt', 'ASC')
    ->get();
  }
  
  public function getRowsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    $rows = SheetRow::where('sheetId', '=', $sheetId)
    ->orderBy('createdAt', 'ASC')
    ->get();
    return $rows;
  }
  
  public function filters() {
    return $this->hasMany('App\Models\SheetFilter', 'sheetId')->orderBy('createdAt');
  }
  
  public function groups() {
    return $this->hasMany('App\Models\SheetGroup', 'sheetId')->orderBy('createdAt');
  }

  public function sorts() {
    return $this->hasMany('App\Models\SheetSort', 'sheetId')->orderBy('createdAt');
  }

  public function getStylesAttribute() {
    return SheetStyles::where('sheetId', '=', $this->id)->first();
  }
  
  public function views() {
    return $this->hasMany('App\Models\SheetView', 'sheetId')->orderBy('createdAt');
  }
}