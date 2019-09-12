<?php

use Illuminate\Support\Arr;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        // Users
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
            'organizationId' => $organization->id,
            'name' => $seedUser['name'],
            'email' => $seedUser['email'],
          ]);

          // UserActive
          $user->active()->save(factory(App\Models\UserActive::class)->make());

          // UserColor
          $user->color()->save(factory(App\Models\UserColor::class)->make());
        }

        // Folders
        $sourceFolders = Storage::disk('sources')->allDirectories();
        $seedFolders = [];
        foreach($sourceFolders as $sourceFolder) {
          if(Str::startsWith($sourceFolder, $seedOrganization['sourceFolder'])) {
            array_push($seedFolders, $sourceFolder);
          }
        }
        // Files
        $sourceFiles = Storage::disk('sources')->allFiles();
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

        $createFolders = function($folderItems) use(&$createFolders) {
          foreach($folderItems as $folderItem) {
            $isFolderOrFile = is_array($folderItem) ? 'FOLDER' : 'FILE';
            if($isFolderOrFile === 'FOLDER') {
              $createFolders($folderItem);
            }
            if($isFolderOrFile === 'FILE') {
              echo($folderItem).PHP_EOL;
            }
          }
        };
        $createFolders($structuredSeedFolders);
      }
    }
}
