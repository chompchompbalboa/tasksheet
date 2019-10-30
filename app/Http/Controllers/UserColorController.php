<?php

namespace App\Http\Controllers;

use App\Models\UserColor;
use Illuminate\Http\Request;

class UserColorController extends Controller
{
    public function update(Request $request, UserColor $color)
    { 
      $color->update($request->all());
      return response()->json($color, 200);
    }
}
