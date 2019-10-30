<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetDropdownOption extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetDropdownOptions';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';

  protected $visible = [ 'id', 'sheetDropdownId', 'value' ];
  protected $fillable = [ 'id', 'sheetDropdownId', 'value' ];  
  
  public function dropdown() {
    return $this->belongsTo('App\Models\SheetDropdown', 'sheetDropdownId');
  }
}