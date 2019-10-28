<?php

use Illuminate\Support\Arr;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use App\Utils\Csv;
use App\Http\Controllers\SheetController;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

      // Organizations
      $organizations = [
        [
          // Details
          'name' => 'Tracksheet',

          // Users
          'users' => [
            [ 'name' => 'Rocky Eastman', 'email' => 'eastmanrjr@gmail.com' ],
            [ 'name' => 'Jake Carlson', 'email' => 'jakecarlson88@gmail.com' ],
            [ 'name' => 'Josh Hutchinson', 'email' => 'jghtch@gmail.com' ],
            [ 'name' => 'Justin Bren', 'email' => 'justin.bren47@gmail.com' ],
          ],

          // Source Folder
          'sourceFolder' => 'Tracksheet'
        ]
      ];



      // Seed each organization
      foreach($organizations as $seedOrganization) {

        // Organization Root Folder
        $organizationFolder = factory(App\Models\Folder::class)->create([ 
          'name' => $seedOrganization['sourceFolder'] 
        ]);

        // Organization
        $organization = factory(App\Models\Organization::class)->create([
          'name' => $seedOrganization['name'],
          'folderId' => $organizationFolder->id
        ]);

        // Seed each user
        foreach($seedOrganization['users'] as $seedUser) {

          // User Root Folder
          $userFolder = factory(App\Models\Folder::class)->create([ 
            'name' => explode(' ', $seedUser['name'])[0] 
          ]);

          // User
          $userId = Str::uuid()->toString();
          $user = factory(App\Models\User::class)->create([ 
            'id' => $userId,
            'folderId' => $userFolder->id,
            'name' => $seedUser['name'],
            'email' => $seedUser['email'],
          ]);

          $user->organizations()->attach($organization->id, [
            'id' => Str::uuid()->toString()
          ]);

          // UserActive
          $user->active()->save(factory(App\Models\UserActive::class)->make());

          // UserColor
          $user->color()->save(factory(App\Models\UserColor::class)->make());
        }

        // Get all of the folders from the 'database/sources' directory
        $sourceFolders = Storage::disk('sources')->allDirectories();
        
        // Filter that folder list so only the current organization's folders are included
        $seedFolders = [];
        foreach($sourceFolders as $sourceFolder) {
          if(Str::startsWith($sourceFolder, $seedOrganization['sourceFolder'])) {
            array_push($seedFolders, $sourceFolder);
          }
        }
        
        // Get all of the files from the 'database/sources' directory
        $sourceFiles = Storage::disk('sources')->allFiles();
        
        // Filter that file list so only the current organization's files are included
        $seedFiles = [];
        foreach($sourceFiles as $sourceFile) {
          if(Str::startsWith($sourceFile, $seedOrganization['sourceFolder'])) {
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
        $createFolders = function($level, $path, $parentFolderId, $folderItems) use(&$createFolders, $seedOrganization) {
          
          // Skip the root folder since we previously created it while creating the organization
          if($level === 0) {
            $createFolders(1, $seedOrganization['sourceFolder'].'/', $parentFolderId, $folderItems[$seedOrganization['sourceFolder']]);
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

                // Recursively create the subfolders
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
                
                // Load the CSV we'll create the sheet from
                $sourceCsv = Storage::disk('sources')->get($path.$folderItem);
                $sourceCsvRows = Csv::toArray('database/sources/'.$path.$folderItem);
                
                // Create the sheet columns, rows and cells
                SheetController::createSheetColumnsRowsAndCellsFromArrayOfRows($newSheet, $sourceCsvRows);
              }
            } 
          }
        };
        $createFolders(0, null, $organizationFolder->id, $structuredSeedFolders);
      }
    }
}
