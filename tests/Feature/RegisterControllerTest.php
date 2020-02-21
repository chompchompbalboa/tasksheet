<?php

namespace Tests\Feature;

use Tests\TestCase;

use Illuminate\Support\Facades\Auth;

use App\Models\Folder;
use App\Models\FolderPermission;
use App\Models\File;
use App\Models\FilePermission;
use App\Models\User;
use App\Models\UserActive;
use App\Models\UserColor;
use App\Models\UserStripeSubscription;
use App\Models\UserTasksheetSubscription;

class RegisterControllerTest extends TestCase
{
  
    /**
     * If we try to register an existing user, the controller should instead
     * attempt to authenticate the user. If the authenticaton succeeds, we 
     * should log the user in and return a 200 code, which will trigger a 
     * reload on the front end
     *
     * @return void
     */
    public function testLoginAndReturn200IfUserExistsAndPasswordIsCorrect()
    {
      $user = User::first();
      $response = $this->postJson('/user/register', [
        'name' => $user->name,
        'email' => $user->email,
        'password' => env('APP_DEFAULT_PASSWORD')
      ]);
      $response->assertStatus(200);
    }
  
    /**
     * If we try to register an existing user, the controller should instead
     * attempt to authenticate the user. If the password is incorrect, we 
     * return a 409 code, which triggers an error message on the front end
     *
     * @return void
     */
    public function testReturn409IfUserExistsAndPasswordIsIncorrect()
    {
      $user = User::first();
      $response = $this->postJson('/user/register', [
        'name' => $user->name,
        'email' => $user->email,
        'password' => 'the wrong password'
      ]);
      $response->assertStatus(409);
    }
  
    /**
     * Verify that a new user registration is successful 
     *
     * @return void
     */
    public function testRegistration()
    {
      $response = $this->postJson('/user/register', [
        'name' => 'Test Name',
        'email' => 'test@test.com',
        'password' => 'testpassword'
      ]);
      // User
      $user = User::where('email', '=', 'test@test.com')->first();
      $this->assertTrue($user !== null);
      // StripeSubscription
      $this->assertTrue(UserStripeSubscription::where('user_id', '=', $user->id)->exists());
      // TasksheetSubscription
      $this->assertTrue(UserTasksheetSubscription::where('userId', '=', $user->id)->exists());
      // User Active
      $this->assertTrue(UserActive::where('userId', '=', $user->id)->exists());
      // User Color
      $this->assertTrue(UserColor::where('userId', '=', $user->id)->exists());
      // Your First Folder
      $this->assertTrue($user->folders()->first()->name === 'Your First Folder');
      // Your First File
      $yourFirstFile = $user->files()->first();
      $this->assertTrue($yourFirstFile->name === 'Your First Sheet');
      // Active Tabs
      $this->assertTrue($user->active->tab === $yourFirstFile->id);
      $this->assertTrue($user->active->tabs === [ $yourFirstFile->id ]);
      // Log the user in 
      $this->assertTrue(Auth::check());
      // Return a 201 code
      $response->assertStatus(201);
    }
}
