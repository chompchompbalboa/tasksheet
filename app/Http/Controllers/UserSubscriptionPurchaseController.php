<?php

namespace App\Http\Controllers;

use Carbon\Carbon;

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
          $userSubscription = $user->subscription()->first();
          $userSubscription->type = 'LIFETIME';
          $userSubscription->startDate = Carbon::now();
          $userSubscription->endDate = null;
          $userSubscription->save();
          return response($userSubscription, 200);
        }
        else {
          return response('', 500);
        }
      } catch (Exception $e) {
        return($e);
      }
    }
    

    public function subscriptionPurchaseMonthly(Request $request, User $user)
    {
      $stripeSetupIntentPaymentMethodId = $request->input('stripeSetupIntentPaymentMethodId');
      try {
        $user->addPaymentMethod($stripeSetupIntentPaymentMethodId);
        $user->save();
        $userSubscription = $user->subscription()->first();
        $userSubscription->type = 'MONTHLY';
        $userSubscription->save();
        return response ($userSubscription, 200);
      } catch (Exception $e) {
        return($e);
      }
    }
}
