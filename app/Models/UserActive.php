<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActive extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userActive';
  protected $visible = ['id', 'tab', 'tabs'];
  protected $fillable = ['tab', 'tabs'];
  protected $casts = [
    'tabs' => 'array'
  ];
  
  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}