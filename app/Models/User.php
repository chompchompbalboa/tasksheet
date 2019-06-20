<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    use Traits\UsesUuid;
  
    protected $appends = ['active'];
    protected $fillable = ['name', 'email', 'password'];
    protected $visible = ['id', 'name', 'email', 'active'];
  
    public function colors() {
      return $this->hasOne('App\Models\UserColors', 'userColorsId');
    }    
    
    public function folder() {
      return $this->hasOne('App\Models\Folder', 'folderId');
    }
  
    public function organization() {
      return $this->belongsTo('App\Models\Organization');
    }
}