<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\SheetCell;

class SheetRow extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetRows';

  protected $visible = ['id', 'cells'];
  protected $fillable = ['id', 'sheetId'];
  protected $appends = ['cells'];
  
  public function getCellsAttribute() {
    return SheetCell::where('rowId', '=', $this->id)
    ->join('sheetColumns', 'sheetCells.columnId', '=', 'sheetColumns.id')
    ->orderBy('sheetColumns.position', 'ASC')
    ->get();
  }
}