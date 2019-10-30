<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserColor extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userColor';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  
  protected $visible = ['id', 'primary', 'secondary'];
  protected $fillable = ['primary', 'secondary'];
  
  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}