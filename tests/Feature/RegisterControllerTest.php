<?php

namespace Tests\Feature;

use Tests\TestCase;

use App\Models\User;

class RegisterControllerTest extends TestCase
{
  
    /**
     * If we try to register an existing user, the controller should instead
     * attempt to authenticate the user
     *
     * @return void
     */
    public function testLoginIfUserExistsAndPasswordIsCorrect()
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
     * Test that the controller returns 
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
      //dd(substr($response->dump(), 0, 100));
      $response->assertStatus(201);
    }
}
