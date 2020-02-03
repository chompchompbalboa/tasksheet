<?php

namespace App\Utils;

use App\Utils\Csv;
use Illuminate\Support\Str;

use App\Models\Sheet;
use App\Models\SheetColumn;
use App\Models\SheetRow;
use App\Models\SheetCell;
use App\Models\SheetView;
use App\Models\SheetFilter;
use App\Models\SheetSort;
use App\Models\SheetGroup;
use App\Models\SheetPriority;
use App\Models\SheetStyles;

class SheetBuilder
{
  
  protected $SHEET_SETTINGS_FLAG = '[TS]';

  protected $validCellTypes = [
    'STRING',
    'DATETIME',
    'BOOLEAN',
    'NUMBER', 
    'PHOTOS', 
    'FILES'
  ];


  public function applyColumnSettings(array $columnIds, array $allColumnSettings) {
    foreach($columnIds as $index => $columnId) {
      if($columnId !== 'COLUMN_BREAK') {
        $sheetColumn = SheetColumn::find($columnId);
        $columnSettings = $allColumnSettings[$index];
        if(array_key_exists('CELL_TYPE', $columnSettings)) {
          if(in_array($columnSettings['CELL_TYPE'], $this->validCellTypes)) {
            $sheetColumn->cellType = $columnSettings['CELL_TYPE'];
          }
        }
        if(array_key_exists('WIDTH', $columnSettings)) { $sheetColumn->width = $columnSettings['WIDTH']; }
        $sheetColumn->save();
      }
    }
  }

  
  public function createSheet($newSheetId) {

      // Create the sheet
      $newSheet = Sheet::create([ 'id' => $newSheetId ]);

      // Create the default sheet view
      $newSheetView = SheetView::create([ 
        'id' => Str::uuid()->toString(), 
        'sheetId' => $newSheetId,
        'name' => 'All Rows',
        'visibleColumns' => [],
        'isLocked' => false
      ]);
      $newSheet->activeSheetViewId = $newSheetView->id;
      $newSheet->save();
      
      // Create the sheet styles
      $newSheetStyles = SheetStyles::create([ 
        'id' => Str::uuid()->toString(), 
        'sheetId' => $newSheetId 
      ]);
    
      // Create the default sheet priorities
      $prioritiesToCreate = [
        [ 'name' => 'Now', 'backgroundColor' => 'rgb(255, 150, 150)', 'color' => 'black', 'order' => 1 ],
        [ 'name' => 'Soon', 'backgroundColor' => 'rgb(255, 205, 155)', 'color' => 'black', 'order' => 2 ],
        [ 'name' => 'Flagged', 'backgroundColor' => 'rgb(255, 255, 160)', 'color' => 'black', 'order' => 3 ],
      ];
      foreach($prioritiesToCreate as $priorityToCreate) {
        SheetPriority::create([
          'id' => Str::uuid()->toString(),
          'sheetId' => $newSheet->id,
          'name' => $priorityToCreate['name'],
          'backgroundColor' => $priorityToCreate['backgroundColor'],
          'color' => $priorityToCreate['color'],
          'order' => $priorityToCreate['order'],
        ]);
      }

      // Create the sheet columns
      $newSheetColumns = [];
      $newSheetViewVisibleColumns = [];
      $columnsToCreate = [
        [ 'name' => 'Photos', 'cellType' => 'PHOTOS', 'width' => 50, 'trackCellChanges' => false, 'showCellChanges' => false ],
        [ 'name' => 'Files', 'cellType' => 'FILES', 'width' => 50, 'trackCellChanges' => false, 'showCellChanges' => false ],
        [ 'cellType' => 'COLUMN_BREAK' ],
        [ 'name' => 'Category', 'cellType' => 'STRING', 'width' => 100, 'trackCellChanges' => false, 'showCellChanges' => false ],
        [ 'name' => 'Task', 'cellType' => 'STRING', 'width' => 450, 'trackCellChanges' => false, 'showCellChanges' => false ],
        [ 'cellType' => 'COLUMN_BREAK' ],
        [ 'name' => 'Check In', 'cellType' => 'DATETIME', 'width' => 100, 'trackCellChanges' => false, 'showCellChanges' => false ],
        [ 'name' => 'Completed', 'cellType' => 'BOOLEAN', 'width' => 75, 'trackCellChanges' => false, 'showCellChanges' => false ],
        [ 'cellType' => 'COLUMN_BREAK' ],
        [ 'name' => 'Notes', 'cellType' => 'STRING', 'width' => 450, 'trackCellChanges' => true, 'showCellChanges' => true ],
      ];
      foreach($columnsToCreate as $columnToCreate) {
        if($columnToCreate['cellType'] === 'COLUMN_BREAK') {
          array_push($newSheetViewVisibleColumns, 'COLUMN_BREAK');
        }
        else {
          $newColumnId = Str::uuid()->toString();
          array_push($newSheetViewVisibleColumns, $newColumnId);
          array_push($newSheetColumns, [
            'id' => $newColumnId,
            'sheetId' => $newSheet->id,
            'name' => $columnToCreate['name'],
            'cellType' => $columnToCreate['cellType'],
            'width' => $columnToCreate['width'],
            'defaultValue' => null,
            'trackCellChanges' => $columnToCreate['trackCellChanges'],
            'showCellChanges' => $columnToCreate['showCellChanges']
          ]);
        }
      }

      // Create the sheet rows and cells
      $newSheetRows = [];
      $newSheetCells = [];
      for($rowNumber = 0; $rowNumber < 5; $rowNumber++) {
        $newRowId = Str::uuid()->toString();
        array_push($newSheetRows, [ 
          'id' => $newRowId,
          'sheetId' => $newSheet->id
        ]);

        foreach($newSheetColumns as $index => $column) {
          array_push($newSheetCells, [
            'id' => Str::uuid()->toString(),
            'sheetId' => $newSheet->id,
            'columnId' => $column['id'],
            'rowId' => $newRowId,
            'value' => null
          ]);
        }
      }

      // Save the columns, rows, and cells to the database
      SheetColumn::insert($newSheetColumns);
      SheetRow::insert($newSheetRows);
      SheetCell::insert($newSheetCells);

      // Save the sheet view's visibleColumns
      $newSheetView->visibleColumns = $newSheetViewVisibleColumns;
      $newSheetView->save();
  }


  public static function createSheetColumnsRowsAndCellsFromCsvRows($newSheet, $csvRows) {
    // Create the sheet's columns by building an array that will be bulk 
    // inserted into the database. During column creation, we also build 
    // the sheet view's visible columns
    $newSheetColumns = [];
    $columnIds = [];
    $currentColumnIndex = 0;
    foreach($csvRows[0] as $columnName => $cellValue) {
      // Bail out if the current column is a column break
      if(!Str::contains($columnName, 'COLUMN_BREAK')) {
        // Create the new column.
        $newColumnId = Str::uuid()->toString();
        $nextColumnWidth = max(50, strlen($columnName) * 8);
        array_push($newSheetColumns, [
          'id' => $newColumnId,
          'sheetId' => $newSheet->id,
          'name' => $columnName,
          'cellType' => SheetUtils::getCellType($cellValue),
          'width' => $nextColumnWidth,
          'defaultValue' => null,
          'trackCellChanges' => false,
          'showCellChanges' => true,
        ]);

        // Add the new column id to the sheet view's visible columns
        $columnIds[$currentColumnIndex] = $newColumnId;
      }
      else {
        // If it is a column break, add it to the sheet view's visible columns
        $columnIds[$currentColumnIndex] = 'COLUMN_BREAK';
      }
      $currentColumnIndex++;
    }

    // Create the sheet's row and cell's by building an array that will be 
    // bulk inserted into the database. 
    $newSheetRows = [];
    $newSheetCells = [];
    foreach($csvRows as $rowFromCsv) {

      // Bail out if this row contains configuration data
      $firstCellValue = $rowFromCsv[array_keys($rowFromCsv)[0]];
      if(!Str::contains($firstCellValue, '[TS]')) {

        // Create the new row
        $newRowId = Str::uuid()->toString();
        array_push($newSheetRows, [ 
          'id' => $newRowId,
          'sheetId' => $newSheet->id 
        ]);

        // Create the new cells
        foreach($newSheetColumns as $index => $column) {
          $cellValue = $rowFromCsv[$column['name']];
          array_push($newSheetCells, [
            'id' => Str::uuid()->toString(),
            'sheetId' => $newSheet->id,
            'columnId' => $column['id'],
            'rowId' => $newRowId,
            'value' => $cellValue
          ]);
          $cellValueLength = strlen($cellValue);
          $defaultColumnWidth = $newSheetColumns[$index]['width'];
          $newColumnWidth = min(300, max($cellValueLength * 8, $defaultColumnWidth));
          $newSheetColumns[$index]['width'] = $newColumnWidth;
        }
      }
    }

    // Save the sheet columns
    SheetColumn::insert($newSheetColumns);

    // Save the sheet rows
    foreach (array_chunk($newSheetRows, 2500) as $chunk) {
      SheetRow::insert($chunk);
    }

    // Save the sheet cells
    foreach (array_chunk($newSheetCells, 2500) as $chunk) {
      SheetCell::insert($chunk);
    }  

    return $columnIds;
  }
  
  
  private function createSheetFilter(string $sheetId, string $sheetViewId, string $sheetColumnId, string $sheetViewSettingValue) {
    $sheetFilterSettings = $this->getSheetViewSetting($sheetViewSettingValue);
    SheetFilter::create([
      'id' => Str::uuid()->toString(), 
      'sheetId' => $sheetId,
      'sheetViewId' => $sheetViewId,
      'columnId' => $sheetColumnId,
      'value' => $sheetFilterSettings['VALUE'],
      'type' => str_replace('**', '', $sheetFilterSettings['TYPE']),
      'isLocked' => false,
      'createdAt' => $sheetFilterSettings['CREATED_AT']
    ]);
  }
  
  
  private function createSheetGroup(string $sheetId, string $sheetViewId, string $sheetColumnId, string $sheetViewSettingValue) {
    $sheetGroupSettings = $this->getSheetViewSetting($sheetViewSettingValue);
    SheetGroup::create([
      'id' => Str::uuid()->toString(), 
      'sheetId' => $sheetId,
      'sheetViewId' => $sheetViewId,
      'columnId' => $sheetColumnId,
      'order' => $sheetGroupSettings['ORDER'],
      'isLocked' => false,
      'createdAt' => $sheetGroupSettings['CREATED_AT']
    ]);
  }
  
  
  private function createSheetSort(string $sheetId, string $sheetViewId, string $sheetColumnId, string $sheetViewSettingValue) {
    $sheetSortSettings = $this->getSheetViewSetting($sheetViewSettingValue);
    SheetSort::create([
      'id' => Str::uuid()->toString(), 
      'sheetId' => $sheetId,
      'sheetViewId' => $sheetViewId,
      'columnId' => $sheetColumnId,
      'order' => $sheetSortSettings['ORDER'],
      'isLocked' => false,
      'createdAt' => $sheetSortSettings['CREATED_AT']
    ]);
  }

  
  public function createSheetViews(string $sheetId, array $visibleColumns, array $sheetViewsSettings) {
    $newSheetViewIds = [];
    foreach($sheetViewsSettings as $sheetViewSettings) {
      $sheetViewName = $this->getSheetViewName($sheetViewSettings);
      // Create the sheet view
      $newSheetView = SheetView::create([ 
        'id' => Str::uuid()->toString(), 
        'sheetId' => $sheetId,
        'name' => $sheetViewName,
        'isLocked' => false,
        'visibleColumns' => $visibleColumns
      ]);
      array_push($newSheetViewIds, $newSheetView->id);
      foreach($sheetViewSettings as $index => $sheetViewSettingsColumn) {
        $sheetColumnId = $visibleColumns[$index];
        foreach($sheetViewSettingsColumn as $sheetViewSettingKey => $sheetViewSettingValue) {
          switch($sheetViewSettingKey) {
            case 'FILTER':
              $this->createSheetFilter($sheetId, $newSheetView->id, $sheetColumnId, $sheetViewSettingValue);
            break;
            case 'GROUP':
              $this->createSheetGroup($sheetId, $newSheetView->id, $sheetColumnId, $sheetViewSettingValue);
            break;
            case 'SORT':
              $this->createSheetSort($sheetId, $newSheetView->id, $sheetColumnId, $sheetViewSettingValue);
            break;
            default:
          }
        }
      }
    }
    return $newSheetViewIds;
  }
  
    
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

  
  public function getSheetViewName(array $sheetViewSettings) {
    // The sheet view name is always included in the first cell of the row where the settings are stored
    return $sheetViewSettings[0]['SHEET_VIEW_NAME'];
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
  
  
  private function getSheetViewSetting(string $sheetViewSettingValue) {
    $sheetViewSetting = [];
    $sheetViewSettingValueArray = explode(';', str_replace(['{', '}'], '', $sheetViewSettingValue));
    foreach($sheetViewSettingValueArray as $sheetViewSettingValueString) {
      $sheetViewSettingArray = explode('=', $sheetViewSettingValueString);
      $sheetViewSettingKey = $sheetViewSettingArray[0];
      if(count($sheetViewSettingArray) > 2) {
        array_shift($sheetViewSettingArray);
        $sheetViewSettingValue = implode('=', $sheetViewSettingArray);
      }
      else {
        $sheetViewSettingValue = $sheetViewSettingArray[1];
      }
      $sheetViewSetting[$sheetViewSettingKey] = $sheetViewSettingValue;
    }
    return $sheetViewSetting;
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
