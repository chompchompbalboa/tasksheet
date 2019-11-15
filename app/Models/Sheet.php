<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet extends Model
{
  use Traits\UsesUuid;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = ['id', 'sourceSheetId', 'defaultSheetViewId', 'activeSheetViewId', 'rows', 'columns', 'views', 'styles', 'notes', 'priorities'];
  protected $fillable = ['id', 'sourceSheetId', 'defaultSheetViewId', 'activeSheetViewId'];
  protected $with = ['notes', 'priorities', 'views'];
  protected $appends = ['columns', 'rows', 'styles'];
  
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

  public function getStylesAttribute() {
    return SheetStyles::where('sheetId', '=', $this->id)->first();
  }
  
  public function notes() {
    return $this->hasMany('App\Models\SheetNote', 'sheetId')->orderBy('createdAt', 'desc');
  }
  
  public function priorities() {
    return $this->hasMany('App\Models\SheetPriority', 'sheetId')->orderBy('order', 'asc');
  }
  
  public function views() {
    return $this->hasMany('App\Models\SheetView', 'sheetId')->orderBy('createdAt');
  }
}