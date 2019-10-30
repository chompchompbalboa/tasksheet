<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\User;

class TeamMemberController extends Controller
{
    public function store(Request $request)
    {
      $user = User::where('email', $request->input('newMemberEmail'))->firstOrFail();
      $user->teams()->attach($request->input('teamId'), [ 'id' => Str::uuid()->toString() ]);
      return $user->teams()->findOrFail($request->input('teamId'));
    }

    public function destroy(Request $request)
    {
      $user = User::find($request->input('teamMemberId'));
      if($user->teams()->detach($request->input('teamId'))) {
        return response(null, 200);
      }
      else {
        return response(null, 406);
      }
    }
}
