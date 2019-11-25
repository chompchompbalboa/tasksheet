<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Controller;

use App\Models\Folder;
use App\Models\User;
use App\Models\UserActive;
use App\Models\UserColor;


class RegisterController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function register(Request $request)
    {
      // Log an existing user in
      if(Auth::attempt([
        'email' => $request->input('email'),
        'password' => $request->input('password')
      ])) {
        return response()->json(true, 200);
      }
      else {
        $newUser = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string'],
        ]);
        // Create the user folder
        $newUserFolder = Folder::create([
          'id' => Str::uuid()->toString(),
          'name' => 'Your First Folder'
        ]);
        $newUser = User::create([
            'name' => $newUser['name'],
            'email' => $newUser['email'],
            'password' => Hash::make($newUser['password']),
            'folderId' => $newUserFolder->id
        ]);
        $newUser->active()->save(factory(\App\Models\UserActive::class)->make());
        $newUser->color()->save(factory(\App\Models\UserColor::class)->make());
        $newUser->subscription()->save(factory(\App\Models\UserSubscription::class)->make([
          'type' => 'TRIAL'
        ]));
        Auth::loginUsingId($newUser->id, true);
        return response()->json(true, 200);
      }
    }
}
