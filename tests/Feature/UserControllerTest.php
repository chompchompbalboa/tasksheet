<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use Tests\TestCase;

use App\Models\User;

class UserControllerTest extends TestCase
{
    /**
     * Update User Name
     *
     * @return void
     */
    public function testUpdateUserName()
    {
      $user = User::first();
      $nextUserName = 'Next Name';
      $response = $this->actingAs($user)->patchJson('/app/user/'.$user->id, [
        'name' => $nextUserName
      ]);
      $updatedUser = User::find($user->id);
      $this->assertEquals($nextUserName, $updatedUser->name);
      $response->assertStatus(200);
    }
    /**
     * Update User Password
     *
     * @return void
     */
    public function testUpdateUserPassword()
    {
      $user = User::first();
      $nextUserPassword = 'New Password';
      $response = $this->actingAs($user)->postJson('/app/user/password/'.$user->id, [
        'currentPassword' => env('APP_DEFAULT_PASSWORD'),
        'newPassword' => $nextUserPassword
      ]);
      $this->assertTrue(Auth::attempt([
        'email' => $user->email,
        'password' => $nextUserPassword
      ]));
      $response->assertStatus(200);
    }

    /**
     * Update User Password Fails When Current Password Is Incorrect
     *
     * @return void
     */
    public function testUpdateUserPasswordFailsWhenCurrentPasswordIsIncorrect()
    {
      $user = User::first();
      $response = $this->actingAs($user)->postJson('/app/user/password/'.$user->id, [
        'currentPassword' => 'Wrong Password',
        'newPassword' => 'New Password'
      ]);
      $response->assertStatus(400);
    }
}
