<?php

namespace App\Http\Controllers;

use App\Models\UserActive;
use Illuminate\Http\Request;

class UserSubscriptionStripeController extends Controller
{
    public function update(Request $request, UserActive $active)
    { 
      $active->update($request->all());
      return response()->json($active, 200);
    }
}
