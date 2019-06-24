<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    use Traits\UsesUuid;
  
    protected $fillable = ['name', 'email', 'password'];
    protected $visible = ['id', 'name', 'email', 'color', 'layout'];
    protected $with = ['color', 'layout'];
  
    public function color() {
      return $this->hasOne('App\Models\UserColor', 'userId');
    }
    
    public function folder() {
      return $this->belongsTo('App\Models\Folder', 'folderId');
    }
  
    public function layout() {
      return $this->hasOne('App\Models\UserLayout', 'userId');
    }
  
    public function organization() {
      return $this->belongsTo('App\Models\Organization', 'organizationId');
    }
}