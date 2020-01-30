<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSortsheetSubscription extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userSubscription';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  
  protected $visible = [ 'id', 'type', 'startDate', 'endDate', 'stripeSetupIntentClientSecret' ];
  protected $fillable = [ 'type', 'startDate', 'endDate' ];
  protected $dates = [ 'startDate', 'endDate' ];
  protected $appends = [ 'stripeSetupIntentClientSecret' ];
  
  public function getStripeSetupIntentClientSecretAttribute() {
    if($this->type === 'TRIAL') {
      $stripeSetupIntent = $this->user()->first()->createSetupIntent();
      return $stripeSetupIntent->client_secret;
    }
    return null;
  }

  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}