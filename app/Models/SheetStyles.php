<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetStyles extends Model
{
  use Traits\UsesUuid;

  protected $table = 'sheetStyles';

  protected $visible = ['id', 'sheetId', 'backgroundColor', 'backgroundColorReference', 'bold', 'color', 'colorReference', 'italic'];
  protected $fillable = ['id', 'sheetId', 'backgroundColor', 'backgroundColorReference', 'bold', 'color', 'colorReference', 'italic'];
  protected $casts = [
    'backgroundColor' => 'array',
    'backgroundColorReference' => 'object',
    'bold' => 'array',
    'color' => 'array',
    'colorReference' => 'object',
    'italic' => 'array',
  ];
}