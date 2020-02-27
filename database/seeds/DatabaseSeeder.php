<?php

use Carbon\Carbon;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use App\Models\FilePermission;
use App\Models\FolderPermission;
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
      $users = [
        'rocky@tasksheet.co' => [ 'id' => Str::uuid()->toString(), 'email' => 'rocky@tasksheet.co', 'name' => 'Rocky Eastman', 'subscriptionType' => 'LIFETIME' ],
        'rocky@dillonworks.com' => [ 'id' => Str::uuid()->toString(), 'email' => 'rocky@dillonworks.com', 'name' => 'Rocky Eastman', 'subscriptionType' => 'LIFETIME' ],
        'demo@tasksheet.co' => [ 'id' => Str::uuid()->toString(), 'email' => 'demo@tasksheet.co', 'name' => 'Demo', 'subscriptionType' => 'DEMO' ],
        'trial@tasksheet.co' => [ 'id' => Str::uuid()->toString(), 'email' => 'trial@tasksheet.co', 'name' => 'Trial', 'subscriptionType' => 'TRIAL' ],
        'monthly@tasksheet.co' => [ 'id' => Str::uuid()->toString(), 'email' => 'monthly@tasksheet.co', 'name' => 'Monthly', 'subscriptionType' => 'MONTHLY' ],
        'lifetime@tasksheet.co' => [ 'id' => Str::uuid()->toString(), 'email' => 'lifetime@tasksheet.co', 'name' => 'Lifetime', 'subscriptionType' => 'LIFETIME' ],
      ];

      // The source folders
      $allSourceFolders = [
        [ 'name' => 'Tasksheet',
          'users' => [
            'rocky@tasksheet.co'
          ]
        ],
        [ 'name' => 'Demos',
          'users' => [
            'rocky@tasksheet.co',
            'demo@tasksheet.co',
            'trial@tasksheet.co',
            'monthly@tasksheet.co',
            'lifetime@tasksheet.co'
          ]
        ],
        [ 'name' => 'Dillon Works',
          'users' => [
            'rocky@tasksheet.co',
            'demo@tasksheet.co'
          ]
        ],
      ];

      // Keep track of already added users
      $newUsers = collect();

      // Seed each team
      foreach($allSourceFolders as $currentSourceFolder) {

        // Source Folder
        $currentSourceFolderModel = factory(App\Models\Folder::class)->create([ 
          'name' => $currentSourceFolder['name'] 
        ]);

        // Seed each user
        foreach($currentSourceFolder['users'] as $currentSourceFolderUser) {

          // Make sure we haven't already seeded the user
          if(!$newUsers->contains('email', $users[$currentSourceFolderUser]['email'])) {

            // User Root Folder
            $userFolder = factory(App\Models\Folder::class)->create([ 
              'name' => 'Your Files'
            ]);

            // User
            $user = factory(App\Models\User::class)->create([ 
              'id' => $users[$currentSourceFolderUser]['id'],
              'name' => $users[$currentSourceFolderUser]['name'],
              'email' => $users[$currentSourceFolderUser]['email']
            ]);

            // Assign the user to the new folder
            FolderPermission::create([
              'id' => Str::uuid()->toString(),
              'userId' => $user->id,
              'folderId' => $userFolder->id,
              'role' => 'OWNER'
            ]);

            // UserActive
            $user->active()->save(factory(App\Models\UserActive::class)->make());

            // UserColor
            $user->color()->save(factory(App\Models\UserColor::class)->make());

            // UserSubscription
            $user->tasksheetSubscription()->save(factory(App\Models\UserTasksheetSubscription::class)->make([
              'type' => $users[$currentSourceFolderUser]['subscriptionType'],
              'subscriptionStartDate' => Carbon::now(),
              'subscriptionEndDate' => Carbon::now()->addDays(30),
              'trialStartDate' => Carbon::now(),
              'trialEndDate' => Carbon::now()->addDays(30),
            ]));

            // Stripe Subscription
            $user->newSubscription('Monthly', env('STRIPE_TASKSHEET_MONTHLY_PLAN_ID'))->trialDays(30)->create();

            // Add email to newUsers
            $newUsers->push($user);
          }
          // If we have already seeded the user, get the user
          else {
            $user = $newUsers->firstWhere('email', $users[$currentSourceFolderUser]['email']);
          }

          // Assign the user to the new folder
          FolderPermission::create([
            'id' => Str::uuid()->toString(),
            'userId' => $user->id,
            'folderId' => $currentSourceFolderModel->id,
            'role' => 'OWNER'
          ]);
        }

        // Get all of the folders from the 'database/sources' directory
        $sourceFolders = Storage::disk('sources')->allDirectories();

        // Filter that folder list so only the current team's folders are included
        $seedFolders = [];
        foreach($sourceFolders as $sourceFolder) {
          if(Str::startsWith($sourceFolder, $currentSourceFolder['name'])) {
            array_push($seedFolders, $sourceFolder);
          }
        }
        
        // Get all of the files from the 'database/sources' directory
        $sourceFiles = Storage::disk('sources')->allFiles();
        
        // Filter that file list so only the current team's files are included
        $seedFiles = [];
        foreach($sourceFiles as $sourceFile) {
          if(Str::startsWith($sourceFile, $currentSourceFolder['name'])) {
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
        $createFolders = function($level, $path, $parentFolderId, $folderItems) use(&$createFolders, $currentSourceFolder, $users) {
          
          // Skip the root folder since we previously created it while creating the team
          if($level === 0) {
            $createFolders(1, $currentSourceFolder['name'].'/', $parentFolderId, $folderItems[$currentSourceFolder['name']]);
          }
          
          else  {
            // Seed each folder item
            foreach($folderItems as $folderName => $folderItem) {

              // Is a folder or file?
              $isFolderOrFile = is_array($folderItem) ? 'FOLDER' : 'FILE';

              // Is Folder
              if($isFolderOrFile === 'FOLDER') {

                // Echo the folder name
                if(env('APP_ENV') !== 'testing') {
                  echo(str_repeat('--', $level).$folderName).PHP_EOL;
                }

                // Create the folder
                $newFolder = factory(App\Models\Folder::class)->create([ 
                  'name' => $folderName,
                  'folderId' => $parentFolderId
                ]);
                
                // Create the folder permissions
                foreach($currentSourceFolder['users'] as $currentUser) {
                  FolderPermission::create([
                    'id' => Str::uuid()->toString(),
                    'userId' => $users[$currentUser]['id'],
                    'folderId' => $newFolder->id,
                    'role' => 'OWNER'
                  ]);
                }

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
                if(env('APP_ENV') !== 'testing') {
                  echo(str_repeat('--', $level).$newFileName).PHP_EOL;
                }

                // Create the file
                $newFile = factory(App\Models\File::class)->create([
                  'id' => $newFileId,
                  'folderId' => $parentFolderId,
                  'typeId' => $newSheetId,
                  'name' => $newFileName,
                ]);
                
                // Create the file permissions
                foreach($currentSourceFolder['users'] as $currentUser) {
                  FilePermission::create([
                    'id' => Str::uuid()->toString(),
                    'userId' => $users[$currentUser]['id'],
                    'fileId' => $newFile->id,
                    'role' => 'OWNER'
                  ]);
                }

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
        $createFolders(0, null, $currentSourceFolderModel->id, $structuredSeedFolders);
      }
    }
}
