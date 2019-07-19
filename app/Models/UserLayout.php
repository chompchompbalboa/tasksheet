<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLayout extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userLayout';
  protected $visible = ['id', 'sheetActionsHeight', 'sidebarWidth', 'tabsHeight'];
  protected $fillable = ['sidebarWidth'];
  protected $appends = ['sheetActionsHeight', 'tabsHeight'];
  
  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
  
  public function getSheetActionsHeightAttribute() {
    return 0.05;
  } 
  public function getTabsHeightAttribute() {
    return 0.03;
  }
}