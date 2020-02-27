<?php

namespace Tests\Feature;

use Tests\TestCase;

use Carbon\Carbon;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\UserTasksheetSubscription;
use App\Http\Controllers\UserSubscriptionPurchaseController;

class UserSubscriptionPurchaseControllerTest extends TestCase
{
    /**
     * When the user successfully purchases a lifetime subscription
     * we need to update their Tasksheet subscription info.
     *
     * @return void
     */
    public function testSubscriptionPurchaseLifetimeSuccess()
    {
      $user = factory(\App\Models\User::class)->make([
        'id' => Str::uuid()->toString(),
        'name' => 'Test User',
        'email' => 'test@test.com'
      ]);
      $user->tasksheetSubscription()->save(factory(\App\Models\UserTasksheetSubscription::class)->make([
        'type' => 'TRIAL',
        'subscriptionStartDate' => null,
        'subscriptionEndDate' => null,
        'trialStartDate' => Carbon::now()->addDays(-15),
        'trialEndDate' => Carbon::now()->addDays(15),
      ]));
      $purchaseController = new UserSubscriptionPurchaseController;
      $subscriptionStartDate = Carbon::now();
      
      $purchaseController->subscriptionPurchaseLifetimeSuccess($user, $subscriptionStartDate);
      
      $this->assertSame($user->tasksheetSubscription->type, 'LIFETIME');
      $this->assertSame($user->tasksheetSubscription->subscriptionEndDate, null);
      $subscriptionStartDate = new Carbon($user->tasksheetSubscription->subscriptionStartDate);
      $expectedSubscriptionStartDate = new Carbon($subscriptionStartDate); 
      $this->assertSame(
        $subscriptionStartDate->dayOfYear, 
        $expectedSubscriptionStartDate->dayOfYear
      );
    }
    /**
     * When the user successfully purchases a monthly subscription
     * we need to update their Tasksheet subscription info.
     *
     * @return void
     */
    public function testSubscriptionPurchaseMonthlySuccess()
    {
      $user = factory(\App\Models\User::class)->make([
        'id' => Str::uuid()->toString(),
        'name' => 'Test User',
        'email' => 'test@test.com'
      ]);
      $user->tasksheetSubscription()->save(factory(\App\Models\UserTasksheetSubscription::class)->make([
        'type' => 'TRIAL',
        'subscriptionStartDate' => null,
        'subscriptionEndDate' => null,
        'trialStartDate' => Carbon::now()->addDays(-15),
        'trialEndDate' => Carbon::now()->addDays(15),
      ]));
      $purchaseController = new UserSubscriptionPurchaseController;
      $subscriptionStartDate = Carbon::now();
      $subscriptionEndDateDate = new Carbon($subscriptionStartDate->addMonths(1));
      
      $purchaseController->subscriptionPurchaseMonthlySuccess($user, $subscriptionStartDate);
      
      $this->assertSame($user->tasksheetSubscription->type, 'MONTHLY');
      $subscriptionStartDate = new Carbon($user->tasksheetSubscription->subscriptionStartDate);
      $expectedSubscriptionStartDate = new Carbon($subscriptionStartDate); 
      $this->assertSame(
        $subscriptionStartDate->dayOfYear, 
        $expectedSubscriptionStartDate->dayOfYear
      );
      $subscriptionEndDate = new Carbon($user->tasksheetSubscription->subscriptionEndDate);
      $expectedSubscriptionEndDate = new Carbon($subscriptionEndDate); 
      $this->assertSame(
        $subscriptionEndDate->dayOfYear, 
        $expectedSubscriptionEndDate->dayOfYear
      );
    }
}
