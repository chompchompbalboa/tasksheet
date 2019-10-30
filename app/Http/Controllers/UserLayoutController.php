<?php

namespace App\Http\Controllers;

use App\Models\UserLayout;
use Illuminate\Http\Request;

class UserLayoutController extends Controller
{
    public function update(Request $request, UserLayout $layout)
    { 
      $layout->update($request->all());
      return response()->json($layout, 200);
    }
}
