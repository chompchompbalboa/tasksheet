<?php

namespace App\Utils;

use App\Utils\Csv;
use Illuminate\Support\Str;

class SheetBuilder
{
  
  protected $SHEET_SETTINGS_FLAG = '[TS]';
  
    
  public function getCsvRows($csvFile) {
    return Csv::toArray($csvFile);
  }
  
  
  public function getColumnSettings(array $csvRows) {
    $firstRow = $csvRows[0]; // Column settings are always stored in the first row
    $firstRowFirstCell = $firstRow[array_keys($firstRow)[0]];
    $doesCsvContainColumnSettings = Str::contains($firstRowFirstCell, $this->SHEET_SETTINGS_FLAG);
    
    if($doesCsvContainColumnSettings) {
      $columnSettings = [];
      foreach($firstRow as $currentCell) {
        $settingsInCurrentCell = $this->getSheetSettingsFromCell($currentCell);
        array_push($columnSettings, $settingsInCurrentCell);
      }
      return $columnSettings;
    }
    else {
      return null;
    }
  }
  
  
  public function getSheetViewsSettings(array $csvRows) {
    $doesCsvContainColumnSettings = $this->getColumnSettings($csvRows) !== null;
    $currentRowIndex = $doesCsvContainColumnSettings ? 1 : 0;
    $currentRowContainsSheetViewSettings = true;
    $sheetViewsSettings = [];
    
    while($currentRowContainsSheetViewSettings) {
      $currentRow = $csvRows[$currentRowIndex];
      $currentRowFirstCellValue = $currentRow[array_keys($currentRow)[0]];
      
      if(Str::contains($currentRowFirstCellValue, $this->SHEET_SETTINGS_FLAG)
        && Str::contains($currentRowFirstCellValue, 'SHEET_VIEW')
      ) {
        $currentRowSheetViewSettings = [];
        
        foreach($currentRow as $currentCell) {
          $settingsInCurrentCell = $this->getSheetSettingsFromCell($currentCell);
          array_push($currentRowSheetViewSettings, $settingsInCurrentCell);
        }
        array_push($sheetViewsSettings, $currentRowSheetViewSettings);
        $currentRowIndex++;
      }
      else {
        $currentRowContainsSheetViewSettings = false;
      }
    }
    
    return count($sheetViewsSettings) > 0 ? $sheetViewsSettings : null;
  }
  

  private function getSheetSettingsFromCell(string $cellValue) {
    // Remove the sheet settings flag
    $rawSettingsString = str_replace($this->SHEET_SETTINGS_FLAG, '', $cellValue);
    // Split the string using the end bracket as a delimiter
    $rawSettingsArray = explode(']', $rawSettingsString);
    // If there are settings in the cell
    if(count($rawSettingsArray) > 0) {
      $sheetSettings = [];
      foreach($rawSettingsArray as $rawSetting) {
        // Remove the start bracket from the string
        $rawSettingString = str_replace('[', '', $rawSetting);
        // Split the setting into its key and value using the equal sign as a delimiter
        $rawSettingArray = explode('=', $rawSettingString);
        // If the sheet setting exists
        if(count($rawSettingArray) > 1) {
          // Set the sheet setting key
          $sheetSettingKey = $rawSettingArray[0];
          // Set the sheet setting value
          if(count($rawSettingArray) > 2) {
            // If the sheet setting contains an equal sign, rebuild the string
            array_shift($rawSettingArray);
            $sheetSettingValue = implode('=', $rawSettingArray);
          }
          else {
            $sheetSettingValue = $rawSettingArray[1];
          }
          // Store the sheet setting to the return array
          $sheetSettings[$sheetSettingKey] = $sheetSettingValue;
        }
      }
      return $sheetSettings;
    }
    else {
      return null;
    }
  }
}
