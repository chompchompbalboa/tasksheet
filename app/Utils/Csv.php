<?php

namespace App\Utils;

class Csv
{
  public static function toArray($filename = '', $delimiter = ',') {
    // Bail if the file doesn't exist
    if (!file_exists($filename) || !is_readable($filename)) {
      return false;
    }

    // Variables
    $header = null;
    $data = [];
    
    // Open file
    if (($handle = fopen($filename, 'r')) !== false) {
        
      // Get the csv rows in chunks of 2500
      while (($row = fgetcsv($handle, 2500, $delimiter)) !== false) {
          
        // Get the headers
        if (!$header) {
          $header = [];
          $currentHeaderIndex = 0;
          foreach($row as $currentHeader) {
            $currentHeader = str_replace('"', '', $row[$currentHeaderIndex]);
            $header[$currentHeaderIndex] = $currentHeader === '' ? 'COLUMN_BREAK_'.$currentHeaderIndex : $currentHeader;
            $currentHeaderIndex++;
          }
        }
        
        // Get the row data
        else {
          $data[] = array_combine($header, $row);
        }
      }
      
      // Close the file
      fclose($handle);
    }

    return $data;
  }
}
