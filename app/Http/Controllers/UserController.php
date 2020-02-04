<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function update(Request $request, User $user)
    { 
      $user->update($request->all());
      return response()->json($user, 200);
    }
  
    public function updatePassword(Request $request, User $user)
    { 
      dd('updatePassword');
      $user->update($request->all());
      return response()->json($user, 200);
    }
}
