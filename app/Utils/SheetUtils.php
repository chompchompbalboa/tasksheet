<?php

namespace App\Utils;

use Illuminate\Support\Facades\Auth;

use App\Models\Sheet;
use App\Models\SheetCell;
use App\Models\SheetColumn;
use App\Models\SheetRow;

class SheetUtils
{

  public static function getCellType($value) {
    if (is_bool($value) || $value === 'TRUE' || $value === 'FALSE') return "BOOLEAN";
    if (is_numeric(str_replace('%', '', $value))) return "NUMBER";
    return "STRING";
  }

  public static function createCsv(Sheet $sheet, bool $includeColumnTypeInformation, $visibleRows) {
    // Variables
    $headers = [];
    $columnTypeInformation = [];
    $rows = [];
    $visibleColumns = $sheet->visibleColumns;
    $cellTypes = [
      'STRING',
      'NUMBER',
      'DATETIME',
      'BOOLEAN',
      'PHOTOS',
      'FILES'
    ];
    // Headers and Column Type Information
    foreach($visibleColumns as $visibleColumnId) {
      $column = SheetColumn::find($visibleColumnId);
      if($column) {
        if(in_array($column->typeId, $cellTypes)) {
          array_push($headers, $column->name);
          array_push($columnTypeInformation, '[TS]['.$column->typeId.']');
        }
        else {
          // Handle custom column types
        }
      }
    }
    // Rows
    foreach($visibleRows as $visibleRowId) {
      $row = SheetRow::find($visibleRowId);
      if($row) {
        $rowValues = [];
        foreach($visibleColumns as $visibleColumnId) {
          $cell = SheetCell::where([
            [ 'columnId', $visibleColumnId ],
            [ 'rowId', $visibleRowId ],
          ])->first();
          if($cell) {
            array_push($rowValues, $cell->value);
          }
        }
        array_push($rows, $rowValues);
      }
    }    
    
    // Write csv and return the string
    $csvBuffer = fopen('php://memory', 'r+');
    fputcsv($csvBuffer, $headers);
    if($includeColumnTypeInformation) {
        fputcsv($csvBuffer, $columnTypeInformation);
    }
    foreach ($rows as $row) {
        fputcsv($csvBuffer, $row);
    }
    rewind($csvBuffer);
    $csv = stream_get_contents($csvBuffer);
    return rtrim($csv);
  }
}
