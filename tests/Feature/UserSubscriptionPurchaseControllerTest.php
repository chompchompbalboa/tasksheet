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
        'subscriptionStartDate' => null,
        'subscriptionEndDate' => null,
        'trialStartDate' => CarbonImmutable::now()->addDays(-15),
        'trialEndDate' => CarbonImmutable::now()->addDays(15),
      ]));
      $purchaseController = new UserSubscriptionPurchaseController;
      $subscriptionStartDate = CarbonImmutable::now();
      
      $purchaseController->subscriptionPurchaseLifetimeSuccess($user, $subscriptionStartDate);
      
      $this->assertSame($user->tasksheetSubscription->type, 'LIFETIME');
      $this->assertSame($user->tasksheetSubscription->nextBillingDate, null);
      $userSubscriptionStartDate = new CarbonImmutable($user->tasksheetSubscription->subscriptionStartDate);
      $expectedUserSubscriptionStartDate = new CarbonImmutable($subscriptionStartDate); 
      $this->assertSame(
        $userSubscriptionStartDate->dayOfYear, 
        $expectedUserSubscriptionStartDate->dayOfYear
      );
      $this->assertSame($user->tasksheetSubscription->subscriptionEndDate, null);
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
        'trialStartDate' => CarbonImmutable::now()->addDays(-15),
        'trialEndDate' => CarbonImmutable::now()->addDays(15),
      ]));
      $purchaseController = new UserSubscriptionPurchaseController;
      $subscriptionStartDate = CarbonImmutable::now();
      
      $purchaseController->subscriptionPurchaseMonthlySuccess($user, $subscriptionStartDate);

      $this->assertSame($user->tasksheetSubscription->type, 'MONTHLY');
      $userSubscriptionStartDate = new CarbonImmutable($user->tasksheetSubscription->subscriptionStartDate);
      $expectedUserSubscriptionStartDate = new CarbonImmutable($subscriptionStartDate); 
      $this->assertSame(
        $userSubscriptionStartDate->dayOfYear, 
        $expectedUserSubscriptionStartDate->dayOfYear
      );
      $userSubscriptionNextBillingDate = new CarbonImmutable($user->tasksheetSubscription->nextBillingDate);
      $expectedUserSubscriptionNextBillingDate = new CarbonImmutable($subscriptionStartDate->addMonths(1)); 
      $this->assertSame(
        $userSubscriptionNextBillingDate->dayOfYear, 
        $expectedUserSubscriptionNextBillingDate->dayOfYear
      );
      $this->assertSame($user->tasksheetSubscription->subscriptionEndDate, null);
    }
}
