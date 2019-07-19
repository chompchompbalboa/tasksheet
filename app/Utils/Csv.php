<?php

namespace App\Utils;

class Csv
{
  public static function toArray($filename = '', $delimiter = ',') {
    if (!file_exists($filename) || !is_readable($filename))
        return false;

    $header = null;
    $data = [];
    if (($handle = fopen($filename, 'r')) !== false){
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== false){
            if (!$header)
                $header = $row;
            else
                $data[] = array_combine($header, $row);
        }
        fclose($handle);
    }

    return $data;
  }
}
