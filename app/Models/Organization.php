<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Organization extends Model
{
  use Traits\UsesUuid;

  protected $visible = [ 'id', 'name', 'users' ];
  protected $fillable = [ 'name' ];
  protected $with = [ 'users' ];
  
  public function users() {
    return $this->belongsToMany('App\Models\User', 'organizationUsers', 'organizationId', 'userId');
  }
  
  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
}