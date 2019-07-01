<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\Folder;
use App\Models\User;

class UserColorTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testUpdateUserColor()
    {
      $user = User::first();
      $response = $this->actingAs($user)->json('PATCH', 'app/user/color/'.$user->color->id, [
        'primary' => 'rgb(255, 255, 0)'
      ]);

      $response
        ->assertStatus(200)
        ->assertJson([
          'id' => $user->color->id,
          'primary' => 'rgb(255, 255, 0)'
        ]);
    }
}
