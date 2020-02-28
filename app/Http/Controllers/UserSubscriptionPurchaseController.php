<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;

use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class UserSubscriptionPurchaseController extends Controller
{
    public function subscriptionPurchaseLifetime(Request $request, User $user)
    {
      $stripePaymentMethodId = $request->input('stripePaymentMethodId');
      try {
        $stripeCharge = $user->charge(10000, $stripePaymentMethodId); // 10000 cents = $100
        if($stripeCharge->isSucceeded()) {
          $this->subscriptionPurchaseLifetimeSuccess($user, CarbonImmutable::now());
        }
        else {
          return response('', 500);
        }
      } catch (Exception $e) {
        return($e);
      }
    }
  
    public function subscriptionPurchaseLifetimeSuccess(User $user, $subscriptionStartDate) {
        $userSubscription = $user->tasksheetSubscription()->first();
        $userSubscription->type = 'LIFETIME';
        $userSubscription->nextBillingDate = null;
        $userSubscription->subscriptionStartDate = $subscriptionStartDate;
        $userSubscription->subscriptionEndDate = null;
        $userSubscription->save();
        return response($userSubscription, 200);
    }

    public function subscriptionPurchaseMonthly(Request $request, User $user)
    {
      $stripeSetupIntentPaymentMethodId = $request->input('stripeSetupIntentPaymentMethodId');
      try {
        if($user->addPaymentMethod($stripeSetupIntentPaymentMethodId)) {
          $this->subscriptionPurchaseMonthlySuccess($user, CarbonImmutable::now());
        }
      } catch (Exception $e) {
        return($e);
      }
    }

    public function subscriptionPurchaseMonthlySuccess(User $user, $subscriptionStartDate) {
      $userSubscription = $user->tasksheetSubscription()->first();
      $userSubscription->type = 'MONTHLY';
      $userSubscription->nextBillingDate = $subscriptionStartDate->addMonths(1);
      $userSubscription->subscriptionStartDate = $subscriptionStartDate;
      $userSubscription->subscriptionEndDate = null;
      $userSubscription->save();
      return response ($userSubscription, 200);
    }
}
