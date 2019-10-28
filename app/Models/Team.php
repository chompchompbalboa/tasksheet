<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Team extends Model
{
  use Traits\UsesUuid;

  protected $visible = [ 'id', 'name', 'members' ];
  protected $fillable = [ 'name' ];
  protected $with = [ 'members' ];
  
  public function members() {
    return $this->belongsToMany('App\Models\User', 'teamUsers', 'teamId', 'userId');
  }
  
  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
}