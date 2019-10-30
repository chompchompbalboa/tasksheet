<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function update(Request $request, Team $team)
    { 
      $team->update($request->all());
      return response()->json($team, 200);
    }
}
