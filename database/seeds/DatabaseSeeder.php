<?php

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use App\Models\SheetView;

use App\Utils\Csv;
use App\Utils\SheetBuilder;

class DatabaseSeeder extends Seeder
{
  
    public function __construct(SheetBuilder $sheetBuilder) 
    {
      $this->sheetBuilder = $sheetBuilder; 
    }

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

      // Teams
      $teams = [
        [ 'name' => 'Tasksheet',
          'sourceFolder' => 'Tasksheet',
          'users' => [
            [ 'name' => 'Rocky Eastman', 'email' => 'rocky@tasksheet.app' ],
        ]],
        [ 'name' => 'Demos',
          'sourceFolder' => 'Demos',
          'users' => [
            [ 'name' => 'Demo', 'email' => 'demo@tasksheet.app' ],
            [ 'name' => 'Rocky Eastman', 'email' => 'rocky@tasksheet.app' ],
        ]],
        [ 'name' => 'Dillon Works',
          'sourceFolder' => 'Dillon Works',
          'users' => [
            [ 'name' => 'Rocky Eastman', 'email' => 'rockye@dillonworks.com' ],
            [ 'name' => 'Rocky Eastman', 'email' => 'rocky@tasksheet.app' ],
        ]],
      ];

      // Keep track of already added users
      $newUsers = collect();

      // Seed each team
      foreach($teams as $seedTeam) {

        // Team Root Folder
        $teamFolder = factory(App\Models\Folder::class)->create([ 
          'name' => $seedTeam['sourceFolder'] 
        ]);

        // Team
        $team = factory(App\Models\Team::class)->create([
          'id' => Str::uuid()->toString(),
          'name' => $seedTeam['name'],
          'folderId' => $teamFolder->id
        ]);

        // Seed each user
        foreach($seedTeam['users'] as $seedUser) {

          // Make sure we haven't already seeded the user
          if(!$newUsers->contains('email', $seedUser['email'])) {

            // User Root Folder
            $userFolder = factory(App\Models\Folder::class)->create([ 
              'name' => 'Your Files'
            ]);

            // User
            $userId = isset($seedUser['id']) ? $seedUser['id'] : Str::uuid()->toString();
            $user = factory(App\Models\User::class)->create([ 
              'id' => $userId,
              'folderId' => $userFolder->id,
              'name' => $seedUser['name'],
              'email' => $seedUser['email']
            ]);

            // UserActive
            $user->active()->save(factory(App\Models\UserActive::class)->make());

            // UserColor
            $user->color()->save(factory(App\Models\UserColor::class)->make());

            // UserSubscription
            $user->subscription()->save(factory(App\Models\UserSubscription::class)->make([
              'type' => $seedUser['email'] === 'demo@tasksheet.app' ? 'DEMO' : 'LIFETIME'
            ]));

            // Add email to newUsers
            $newUsers->push($user);
          }
          // If we have already seeded the user, get the user
          else {
            $user = $newUsers->firstWhere('email', $seedUser['email']);
          }

          // Add the user to the team
          $user->teams()->attach($team->id, [
            'id' => Str::uuid()->toString()
          ]);
        }

        // Get all of the folders from the 'database/sources' directory
        $sourceFolders = Storage::disk('sources')->allDirectories();
        
        // Filter that folder list so only the current team's folders are included
        $seedFolders = [];
        foreach($sourceFolders as $sourceFolder) {
          if(Str::startsWith($sourceFolder, $seedTeam['sourceFolder'])) {
            array_push($seedFolders, $sourceFolder);
          }
        }
        
        // Get all of the files from the 'database/sources' directory
        $sourceFiles = Storage::disk('sources')->allFiles();
        
        // Filter that file list so only the current team's files are included
        $seedFiles = [];
        foreach($sourceFiles as $sourceFile) {
          if(Str::startsWith($sourceFile, $seedTeam['sourceFolder'])) {
            array_push($seedFiles, $sourceFile);
          }
        }
        
        // Structure the folders and files to prepare them for seeding into the database
        $structuredSeedFolders = [];
        foreach($seedFolders as $seedFolder) {
          $seedFolderPathArray = explode('/', $seedFolder);
          if(count($seedFolderPathArray) > 0) {
            $seedFolderDotNotation = implode('.', $seedFolderPathArray);
            Arr::set($structuredSeedFolders, $seedFolderDotNotation, []);
          }
        }
        foreach($seedFiles as $seedFile) {
          $seedFilePathArray = explode('/', $seedFile);
          if(count($seedFilePathArray) > 0) {
            $filename = array_pop($seedFilePathArray);
            if($filename !== '.DS_Store') {
              $seedFileFolderDotNotation = implode('.', $seedFilePathArray);
              $folderFiles = Arr::get($structuredSeedFolders, $seedFileFolderDotNotation);
              array_push($folderFiles, $filename);
              Arr::set(
                $structuredSeedFolders, 
                $seedFileFolderDotNotation, 
                $folderFiles
              );
            }
          }
        }

        // Recursively create the folders
        $createFolders = function($level, $path, $parentFolderId, $folderItems) use(&$createFolders, $seedTeam) {
          
          // Skip the root folder since we previously created it while creating the team
          if($level === 0) {
            $createFolders(1, $seedTeam['sourceFolder'].'/', $parentFolderId, $folderItems[$seedTeam['sourceFolder']]);
          }
          
          else  {
            // Seed each folder item
            foreach($folderItems as $folderName => $folderItem) {

              // Is a folder or file?
              $isFolderOrFile = is_array($folderItem) ? 'FOLDER' : 'FILE';

              // Is Folder
              if($isFolderOrFile === 'FOLDER') {

                // Echo the folder name
                echo(str_repeat('--', $level).$folderName).PHP_EOL;

                // Create the folder
                $newFolder = factory(App\Models\Folder::class)->create([ 
                  'name' => $folderName,
                  'folderId' => $parentFolderId
                ]);

                // Create the subfolders
                $createFolders($level + 1, $path.$folderName.'/', $newFolder->id, $folderItem);
              }

              // Is File
              if($isFolderOrFile === 'FILE') {

                // Details
                $newFileId = Str::uuid()->toString();
                $newSheetId = Str::uuid()->toString();
                $newFileNameArray = explode('.', $folderItem);
                array_pop($newFileNameArray);
                $newFileName = implode('.', $newFileNameArray);

                // Echo the file name
                echo(str_repeat('--', $level).$newFileName).PHP_EOL;

                // Create the file
                $newFile = factory(App\Models\File::class)->create([
                  'id' => $newFileId,
                  'folderId' => $parentFolderId,
                  'typeId' => $newSheetId,
                  'name' => $newFileName,
                ]);

                // Create the sheet
                $newSheet = factory(App\Models\Sheet::class)->create([
                  'id' => $newSheetId
                ]);

                // Create the sheet styles
                $newSheetStyles = factory(App\Models\SheetStyles::class)->create([
                  'id' => Str::uuid()->toString(),
                  'sheetId' => $newSheetId
                ]);

                // Create a sheet view
                $newSheetView = factory(App\Models\SheetView::class)->create([
                  'id' => Str::uuid()->toString(),
                  'sheetId' => $newSheetId,
                  'name' => $newFileName,
                  'visibleColumns' => []
                ]);
                $newSheet->activeSheetViewId = $newSheetView->id;
                $newSheet->save();
                
                // Load the CSV we'll create the sheet from
                //$csvFile = Storage::disk('sources')->get($path.$folderItem);

                // Get rows from the csv
                $csvRows = $this->sheetBuilder->getCsvRows('database/sources/'.$path.$folderItem);
          
                // Create the sheet columns, rows and cells
                $columnIds = $this->sheetBuilder->createSheetColumnsRowsAndCellsFromCsvRows($newSheet, $csvRows);
                
                // Get and apply the column settings from the csv
                $columnSettings = $this->sheetBuilder->getColumnSettings($csvRows);
                if(!is_null($columnSettings)) { 
                  $this->sheetBuilder->applyColumnSettings($columnIds, $columnSettings);
                }
          
                // Get sheet views from the csv
                $sheetViewsSettings = $this->sheetBuilder->getSheetViewsSettings($csvRows);
                if(!is_null($sheetViewsSettings)) {
                  $newSheetViewIds = $this->sheetBuilder->createSheetViews($newSheet->id, $columnIds, $sheetViewsSettings);
                  $newSheet->activeSheetViewId = $newSheetViewIds[0];
                  $newSheet->save();
                }
                else {
                  $newSheetView = SheetView::create([ 
                    'id' => Str::uuid()->toString(), 
                    'sheetId' => $newSheetId,
                    'name' => 'Default View',
                    'isLocked' => false,
                    'visibleColumns' => $columnIds
                  ]);
                  $newSheet->activeSheetViewId = $newSheetView->id;
                  $newSheet->save();
                }
              }
            } 
          }
        };
        $createFolders(0, null, $teamFolder->id, $structuredSeedFolders);
      }
    }
}
