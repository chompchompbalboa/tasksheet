<?php

namespace Tests\Feature;

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
}
