<?php

namespace Tests\Feature;

use Tests\TestCase;

use Carbon\CarbonImmutable;
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
        'billingDayOfMonth' => null,
        'subscriptionStartDate' => null,
        'subscriptionEndDate' => null,
        'trialStartDate' => CarbonImmutable::now()->addDays(-15),
        'trialEndDate' => CarbonImmutable::now()->addDays(15),
      ]));

      $subscriptionStartDate = CarbonImmutable::now();

      $purchaseController = new UserSubscriptionPurchaseController;
      $purchaseController->subscriptionPurchaseLifetimeSuccess($user, $subscriptionStartDate);

      $userSubscriptionStartDate = new CarbonImmutable($user->tasksheetSubscription->subscriptionStartDate);
      $expectedUserSubscriptionStartDate = new CarbonImmutable($subscriptionStartDate); 
      
      $this->assertSame(
        $user->tasksheetSubscription->type, 
        'LIFETIME'
      );
      $this->assertSame(
        $user->tasksheetSubscription->billingDayOfMonth, 
        null
      );
      $this->assertSame(
        $userSubscriptionStartDate->dayOfYear, 
        $expectedUserSubscriptionStartDate->dayOfYear
      );
      $this->assertSame(
        $user->tasksheetSubscription->subscriptionEndDate, 
        null
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
        'billingDayOfMonth' => null,
        'subscriptionStartDate' => null,
        'subscriptionEndDate' => null,
        'trialStartDate' => CarbonImmutable::now()->addDays(-15),
        'trialEndDate' => CarbonImmutable::now()->addDays(15),
      ]));

      $subscriptionStartDate = CarbonImmutable::now();

      $purchaseController = new UserSubscriptionPurchaseController;
      $purchaseController->subscriptionPurchaseMonthlySuccess($user, $subscriptionStartDate);

      $userSubscriptionStartDate = new CarbonImmutable($user->tasksheetSubscription->subscriptionStartDate);
      $expectedUserSubscriptionStartDate = new CarbonImmutable($subscriptionStartDate); 

      $this->assertSame(
        $user->tasksheetSubscription->type, 
        'MONTHLY'
      );
      $this->assertSame(
        $userSubscriptionStartDate->dayOfYear, 
        $expectedUserSubscriptionStartDate->dayOfYear
      );
      $this->assertSame(
        intval($user->tasksheetSubscription->billingDayOfMonth), 
        intval($subscriptionStartDate->day)
      );
      $this->assertSame(
        $user->tasksheetSubscription->subscriptionEndDate, 
        null
      );
    }
}
