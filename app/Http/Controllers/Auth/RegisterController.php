<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Controller;

use App\Models\Folder;
use App\Models\FolderPermission;
use App\Models\File;
use App\Models\FilePermission;
use App\Models\User;
use App\Models\UserActive;
use App\Models\UserColor;

use App\Utils\SheetBuilder;

class RegisterController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(SheetBuilder $sheetBuilder)
    {
        $this->middleware('guest');
        $this->sheetBuilder = $sheetBuilder; 
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
      // Is the email address already in use?
      if(User::where('email', '=', $request->input('email'))->exists()) {
        // Attempt to log them in
        if(Auth::attempt([
          'email' => $request->input('email'),
          'password' => $request->input('password')
        ])) {
          return response(null, 200);
        }
        else {
          return response(null, 409);
        }
      }
      else {
        // Validate the inputs and get the new user's information
        $newUserInfo = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string'],
        ]);

        // Create the new user
        $newUser = User::create([
          'name' => $newUserInfo['name'],
          'email' => $newUserInfo['email'],
          'password' => Hash::make($newUserInfo['password'])
        ]);

        // Create the Stripe subscription
        $newUser->newSubscription('Monthly', env('STRIPE_TASKSHEET_MONTHLY_PLAN_ID'))->trialDays(30)->create();

        // Create the Tasksheet subscription
        $newUser->tasksheetSubscription()->save(factory(\App\Models\UserTasksheetSubscription::class)->make([
          'type' => 'TRIAL',
          'subscriptionStartDate' => null,
          'subscriptionEndDate' => null,
          'trialStartDate' => Carbon::now(),
          'trialEndDate' => Carbon::now()->addDays(30),
        ]));

        // Create userActive and userColor
        $newUser->active()->save(factory(\App\Models\UserActive::class)->make());
        $newUser->color()->save(factory(\App\Models\UserColor::class)->make());

        // Create the user folder
        $newUserFolder = Folder::create([
          'id' => Str::uuid()->toString(),
          'name' => 'Your First Folder'
        ]);

        // Assign the user to the new folder
        FolderPermission::create([
          'id' => Str::uuid()->toString(),
          'userId' => $newUser->id,
          'folderId' => $newUserFolder->id,
          'role' => 'OWNER'
        ]);

        // Create "Your First Sheet"
        $newUserFirstSheetId = Str::uuid()->toString();
        $this->sheetBuilder->createSheet($newUserFirstSheetId);
        $newUserFirstFile = File::create([
          'folderId' => $newUserFolder->id,
          'name' => 'Your First Sheet',
          'type' => 'SHEET',
          'typeId' => $newUserFirstSheetId
        ]);

        // Assign "Your First Sheet" to the new user
        FilePermission::create([
          'id' => Str::uuid()->toString(),
          'userId' => $newUser->id,
          'fileId' => $newUserFirstFile->id,
          'role' => 'OWNER'
        ]);

        // Set the active tabs
        $newUser->active->tab = $newUserFirstFile->id;
        $newUser->active->tabs = [ $newUserFirstFile->id ];
        $newUser->active->save();

        // Log the user in
        Auth::loginUsingId($newUser->id, true);

        // Return the response
        return response(null, 201);
      }
    }
}
