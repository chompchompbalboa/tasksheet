<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSubscription extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userSubscription';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  
  protected $visible = [ 'id', 'type' ];
  protected $fillable = [ 'type' ];
  
  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}