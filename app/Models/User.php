<?php

namespace App\Models;

use Laravel\Cashier\Billable;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Models\Folder;

class User extends Authenticatable
{
    use Billable;
    use Notifiable;
    use Traits\UsesUuid;
  
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
  
    protected $visible = [ 'id', 'name', 'email', 'folderId', 'active', 'color', 'tasksheetSubscription', 'stripeSubscription' ];
    protected $fillable = [ 'name', 'email', 'password', 'folderId' ];
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

    public function dropdowns() {
      return $this->hasMany('App\Models\SheetDropdown', 'userId');
    }
    
    public function folder() {
      return $this->belongsTo('App\Models\Folder', 'folderId');
    }
  
    public function tasksheetSubscription() {
      return $this->hasOne('App\Models\UserTasksheetSubscription', 'userId');
    }
  
    public function teams() {
      return $this->belongsToMany('App\Models\Team', 'teamUsers', 'userId', 'teamId');
    }
}