<?php

namespace App\Http\Controllers;

use App\Models\UserSubscription;
use Illuminate\Http\Request;

class UserSubscriptionController extends Controller
{
    public function update(Request $request, UserSubscription $layout)
    { 
      $layout->update($request->all());
      return response()->json($layout, 200);
    }
}
