<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Models\Folder;

class User extends Authenticatable
{
    use Notifiable;
    use Traits\UsesUuid;
  
    protected $fillable = ['name', 'email', 'password'];
    protected $visible = ['id', 'name', 'email', 'active', 'color', 'layout'];
    protected $with = ['active', 'color', 'layout'];
  
    public function active() {
      return $this->hasOne('App\Models\UserActive', 'userId');
    }
  
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