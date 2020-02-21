<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

class UserController extends Controller
{
    public function update(Request $request, User $user)
    { 
      return(null, 500);
      $user->update($request->all());
      return response()->json($user, 200);
    }
  
    public function updatePassword(Request $request, User $user)
    { 
      if (Hash::check($request->input('currentPassword'), $user->password)) { // Verify current password
        $user->password = Hash::make($request->input('newPassword'));
        $user->save();
        return response(null, 200);
      }
      else {
        return response(null, 400);
      }
    }
}
