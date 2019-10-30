<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Team extends Model
{
  use Traits\UsesUuid;
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = [ 'id', 'name', 'members' ];
  protected $fillable = [ 'name' ];
  protected $with = [ 'members' ];
  
  public function members() {
    return $this->belongsToMany('App\Models\User', 'teamUsers', 'teamId', 'userId')->orderBy('name');
  }
  
  public function folder() {
    return $this->belongsTo('App\Models\Folder', 'folderId');
  }
}