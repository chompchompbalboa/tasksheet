<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserColor extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userColor';
  protected $visible = ['id', 'primary', 'secondary'];
  protected $fillable = ['primary', 'secondary'];
  
  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}