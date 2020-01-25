<?php

namespace App\Models;

use Laravel\Cashier\Billable;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

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
  
    protected $visible = [ 'id', 'name', 'email', 'active', 'color', 'tasksheetSubscription', 'stripeSubscription' ];
    protected $fillable = [ 'name', 'email', 'password' ];
    protected $with = [ 'active', 'color' ];
    protected $appends = [ 'stripeSubscription', 'tasksheetSubscription' ];
  
    public function getTasksheetSubscriptionAttribute() {
      return $this->tasksheetSubscription()->first();
    }
  
    public function getStripeSubscriptionAttribute() {
      return $this->subscriptions()->first();
    }
  
    public function active() {
      return $this->hasOne('App\Models\UserActive', 'userId');
    }
  
    public function color() {
      return $this->hasOne('App\Models\UserColor', 'userId');
    }
    
    public function files() {
      return $this->belongsToMany('App\Models\File', 'filePermissions', 'userId', 'fileId')->orderBy('name')->get();
    }

    public function fileIds() {
      return FilePermission::where('userId', $this->id)->pluck('fileId')->toArray();
    }
    
    public function folders() {
      return $this->belongsToMany('App\Models\Folder', 'folderPermissions', 'userId', 'folderId')->orderBy('name')->get();
    }

    public function folderIds() {
      return FolderPermission::where('userId', $this->id)->pluck('folderId')->toArray();
    }
  
    public function tasksheetSubscription() {
      return $this->hasOne('App\Models\UserTasksheetSubscription', 'userId');
    }
}