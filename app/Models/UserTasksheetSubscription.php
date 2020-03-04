<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTasksheetSubscription extends Model
{
  use Traits\UsesUuid;

  protected $table = 'userSubscription';
  
  const CREATED_AT = 'createdAt';
  const UPDATED_AT = 'updatedAt';
  
  protected $visible = [ 
    'id', 
    'userId',
    'type', 
    'billingDayOfMonth',
    'subscriptionStartDate',
    'subscriptionEndDate',
    'trialStartDate', 
    'trialEndDate', 
    'stripeSetupIntentClientSecret' 
  ];
  protected $fillable = [
    'userId',
    'type', 
    'billingDayOfMonth',
    'subscriptionStartDate', 
    'subscriptionEndDate' 
  ];
  protected $dates = [ 
    'subscriptionStartDate', 
    'subscriptionEndDate', 
    'trialStartDate', 
    'trialEndDate' 
  ];
  protected $appends = [ 
    'stripeSetupIntentClientSecret' 
  ];
  
  public function getStripeSetupIntentClientSecretAttribute() {
    if(in_array($this->type, ['TRIAL', 'TRIAL_EXPIRED', 'MONTHLY_PAST_DUE', 'MONTHLY_EXPIRED'])) {
      if($user = $this->user()->first()) {
        $stripeSetupIntent = $user->createSetupIntent();
        return $stripeSetupIntent->client_secret;
      }
    }
    return null;
  }

  public function user() {
    return $this->belongsTo('App\Models\User', 'userId');
  }
}