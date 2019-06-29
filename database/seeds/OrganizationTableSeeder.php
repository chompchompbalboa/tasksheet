<?php

use Illuminate\Database\Seeder;

class OrganizationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $userFolder = factory(App\Models\Folder::class)->create();
      $users = factory(App\Models\User::class)->create([ 
        'id' => '75e3c4f9-b261-3343-a320-8ee9fb0c931e', 
        'folderId' => $userFolder->id 
      ])->each(function($user) {
        $user->color()->save(factory(App\Models\UserColor::class)->make());
        $user->layout()->save(factory(App\Models\UserLayout::class)->make());
      });
      // User Folder
      // User
      // User Folder Folders ...
      // User Folder Files ...
      // User Folder Sheets ... 
    }
}
