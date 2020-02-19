<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Response
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            return response(null, 200);
        }
        else {
          return response(null, 404);
        }
    }

    /**
     * Log out the authenticated user.
     *
     * @return Response
     */
    public function logout()
    {
      Auth::logout();
      if(!Auth::check()) {
        return response(null, 200);
      }
      else {
        return response(null, 500);
      }
    }
}
