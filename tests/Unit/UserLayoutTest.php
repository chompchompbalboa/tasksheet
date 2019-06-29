<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\Folder;
use App\Models\User;

class UserLayoutTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testUpdateUserLayout()
    {
      $user = User::first();
      $response = $this->actingAs($user)->json('PATCH', 'app/user/layout/'.$user->layout->id, [
        'sidebarWidth' => 0.325
      ]);

      $response
        ->assertStatus(200)
        ->assertJson([
          'id' => $user->layout->id,
          'sidebarWidth' => 0.325
        ]);
    }
}
