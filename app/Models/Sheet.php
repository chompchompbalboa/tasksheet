<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sheet extends Model
{
  use Traits\UsesUuid;
  use SoftDeletes;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = [
    'id', 
    'sourceSheetId', 
    'activeSheetViewId', 
    'columns', 
    'rows',
    'cellPriorities',
    'views',
    'styles',
    'changes',
    'files',
    'labels',
    'photos',
    'priorities',
  ];
  protected $fillable = ['id', 'sourceSheetId', 'activeSheetViewId'];
  protected $with = ['changes', 'files', 'photos', 'priorities', 'views'];
  protected $appends = ['columns', 'rows', 'styles', 'cellPriorities', 'labels'];
  
  public function getColumnsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    return SheetColumn::where('sheetId', '=', $sheetId)
    ->orderBy('createdAt', 'ASC')
    ->get();
  }
  
  public function getRowsAttribute() {
    $sheetId = is_null($this->sourceSheetId) ? $this->id : $this->sourceSheetId;
    return SheetRow::where('sheetId', '=', $sheetId)
    ->orderBy('createdAt', 'ASC')
    ->get();
  }

  public function getStylesAttribute() {
    return SheetStyles::where('sheetId', '=', $this->id)->first();
  }
  
  public function getCellPrioritiesAttribute() {
    return $this->hasMany('App\Models\SheetCellPriority', 'sheetId')->get();
  }
  
  public function changes() {
    return $this->hasMany('App\Models\SheetCellChange', 'sheetId')->orderBy('createdAt', 'desc');
  }
  
  public function files() {
    return $this->hasMany('App\Models\SheetCellFile', 'sheetId')->orderBy('createdAt', 'asc');
  }
  
  public function getLabelsAttribute() {
    return $this->hasMany('App\Models\SheetCellLabel', 'sheetId')->get();
  }
  
  public function photos() {
    return $this->hasMany('App\Models\SheetCellPhoto', 'sheetId')->orderBy('createdAt', 'desc');
  }
  
  public function priorities() {
    return $this->hasMany('App\Models\SheetPriority', 'sheetId')->orderBy('order', 'asc');
  }
  
  public function views() {
    return $this->hasMany('App\Models\SheetView', 'sheetId')->orderBy('createdAt');
  }
}