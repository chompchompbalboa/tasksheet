<?php

namespace App\Models;

use Carbon\Carbon;

use Laravel\Cashier\Billable;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

use App\Models\Folder;
use App\Models\FolderPermission;
use App\Models\FilePermission;

class User extends Authenticatable
{
    use Billable;
    use Notifiable;
    use Traits\UsesUuid;
  
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
  
    protected $visible = [ 'id', 'name', 'email', 'active', 'color', 'tasksheetSubscription' ];
    protected $fillable = [ 'name', 'email', 'password' ];
    protected $with = [ 'active', 'color' ];
    protected $appends = [ 'tasksheetSubscription' ];
  
    public function getTasksheetSubscriptionAttribute() {
      return $this->tasksheetSubscription()->first();
    }
  
    /*
    public function getStripeSubscriptionAttribute() {
      $localSubscription = $this->subscriptions()->first();
      $stripeSubscription = $localSubscription->asStripeSubscription();
      $subscription = [
        'stripeStatus' => $localSubscription->stripe_status,
        'trialEndsAt' => Carbon::parse($localSubscription->trial_ends_at),
        'endsAt' => Carbon::parse($stripeSubscription->current_period_end)
      ];
      return $subscription;
    }
    */
  
    public function active() {
      return $this->hasOne('App\Models\UserActive', 'userId');
    }
  
    public function color() {
      return $this->hasOne('App\Models\UserColor', 'userId');
    }
    
    public function files() {
      // Get the files
      $files = DB::table('filePermissions')
        ->where('filePermissions.userId', '=', $this->id)
        ->join('files', 'filePermissions.fileId', '=', 'files.id')
        ->select(
          'files.id', 
          'files.folderId', 
          'files.userId', 
          'files.name',
          'files.type',
          'files.typeId',
          'filePermissions.role'
        )->get();
      // Attach permissions
      foreach($files as $file) {
        $filePermissions = DB::table('filePermissions')
          ->join('users', function ($join) use($file) {
              $join->on('filePermissions.userId', '=', 'users.id')
                   ->where('filePermissions.fileId', '=', $file->id);
          })
          ->select(
            'filePermissions.id',
            'filePermissions.fileId',
            'filePermissions.userId',
            'users.name AS userName',
            'users.email AS userEmail',
            'filePermissions.role'
          )
          ->orderBy('users.name', 'asc')
          ->get();
        $file->permissions = $filePermissions;
      }
      return $files;
    }

    public function fileIds() {
      return FilePermission::where('userId', $this->id)->pluck('fileId')->toArray();
    }
    
    public function folders() {
      // Get the folders
      $folders = DB::table('folderPermissions')
        ->where('folderPermissions.userId', '=', $this->id)
        ->join('folders', 'folderPermissions.folderId', '=', 'folders.id')
        ->select(
          'folders.id', 
          'folders.folderId', 
          'folders.name',
          'folderPermissions.role'
        )
        ->get();
      // Attach permissions
      foreach($folders as $folder) {
        $folderPermissions = DB::table('folderPermissions')
          ->join('users', function ($join) use($folder) {
              $join->on('folderPermissions.userId', '=', 'users.id')
                   ->where('folderPermissions.folderId', '=', $folder->id);
          })
          ->select(
            'folderPermissions.id',
            'folderPermissions.folderId',
            'folderPermissions.userId',
            'users.name AS userName',
            'users.email AS userEmail',
            'folderPermissions.role'
          )
          ->orderBy('users.name', 'asc')
          ->get();
        $folder->permissions = $folderPermissions;
      }
      return $folders;
    }

    public function folderIds() {
      return FolderPermission::where('userId', $this->id)->pluck('folderId')->toArray();
    }
  
    public function tasksheetSubscription() {
      return $this->hasOne('App\Models\UserTasksheetSubscription', 'userId');
    }
}