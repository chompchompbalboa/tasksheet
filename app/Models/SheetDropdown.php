<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetDropdown extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetDropdowns';

  protected $visible = [ 'id', 'organizationId', 'userId', 'sheetId', 'name', 'cellType', 'data' ];
  protected $fillable = [ 'id', 'organizationId', 'userId', 'sheetId', 'name' ];
  protected $appends = [ 'cellType', 'data' ];

  public function getCellTypeAttribute() {
    return 'DROPDOWN';
  }

  public function getDataAttribute() {
    return [
      'options' => $this->options()
    ];
  }
  
  public function options() {
    $options = SheetDropdownOption::where('sheetDropdownId', $this->id)->get();
    $returnOptions = [];
    foreach($options as $option) {
      $returnOptions[$option->id] = $option;
    }
    return $returnOptions;
  }
}