<?php

namespace App\Utils;

class SheetUtils
{
  public static function getColumnType($value) {
    if (is_bool($value) || $value === 'TRUE' || $value === 'FALSE') return "BOOLEAN";
    if (is_numeric(str_replace('%', '', $value))) return "NUMBER";
    return "STRING";
  }
}
