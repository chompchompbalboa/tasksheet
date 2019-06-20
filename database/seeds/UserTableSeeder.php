<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $users = factory(App\User::class, 1)->create()->each(function ($user) {
        print('User : '.$user->id.PHP_EOL);
        $user->posts()->save(factory(App\Folder::class, 1)->make());
      });
    }
}
