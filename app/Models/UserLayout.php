<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLayout extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userLayout';
  protected $visible = ['id', 'sidebarWidth'];
  protected $fillable = ['sidebarWidth'];
  
  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}