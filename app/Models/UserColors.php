<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserColors extends Model
{
  use Traits\UsesUuid;

  protected $visible = ['id', 'primary', 'secondary', 'tertiary'];
  
  public function user() {
    return $this->belongsTo('App\Models\User');
  }
}