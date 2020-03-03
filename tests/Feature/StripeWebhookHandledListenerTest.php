<?php

namespace Tests\Feature;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\TestCase;

use Laravel\Cashier\Events\WebhookHandled;
use App\Listeners\StripeWebhookHandledListener;

use App\Models\User;
use App\Models\UserTasksheetSubscription;

class StripeWebhookHandledListenerTest extends TestCase
{
    /**
     * Get the mock payload
     *
     * @return $user User
     * @return $payload Stripe's Event object
     */
    private function getMockUserAndPayload(
      string $userType,
      string $stripeEventType,
      string $stripeCustomerStatus
    )
    {
      // Create the User and the UserTasksheetSubscription
      $userId = Str::uuid()->toString();
      $userStripeId = Str::uuid()->toString();
      $currentDate = CarbonImmutable::now();
      $user = factory(\App\Models\User::class)->create([
        'id' => $userId,
        'stripe_id' => $userStripeId,
        'name' => ucfirst(strtolower($userType)).' User',
        'email' => strtolower($userType).'_'.$userId.'@test.com'
      ]);
      factory(\App\Models\UserTasksheetSubscription::class)->create([
        'userId' => $userId,
        'type' => $userType,
        'billingDayOfMonth' => null,
        'subscriptionStartDate' => $currentDate,
        'subscriptionEndDate' => $currentDate,
        'trialStartDate' => $currentDate,
        'trialEndDate' => $currentDate,
      ]);
      
      // Mock the event payload (the Stripe Event object (https://stripe.com/docs/api/events/object))
      $payload = [
        'type' => $stripeEventType,
        'data' => [
          'object' => [ // The Stripe Subscription object https://stripe.com/docs/api/subscriptions/object
            'customer' => $userStripeId,
            'status' => $stripeCustomerStatus
          ]
        ]
      ];
      
      return [ $user, $payload ];
    }
  
    /**
     * Fire the event listener
     *
     * @return $user User
     * @return $payload Stripe's Event object
     */
    private function fireListener(
      string $userType,
      string $stripeEventType,
      string $stripeCustomerStatus
    )
    {
      // Get the user and the paylod
      [ $user, $payload ] = $this->getMockUserAndPayload($userType, $stripeEventType, $stripeCustomerStatus);

      // Fire the listener
      $listener = new StripeWebhookHandledListener();
      $listener->handle(new WebhookHandled($payload));

      // Get and return the UserTasksheetSubscription
      $userTasksheetSubscription = UserTasksheetSubscription::where('userId', $user->id)->first();
      return [ $userTasksheetSubscription, $payload ];
    }

    /**
     * Does the Cashier WebhookHandled event trigger the StripeWebhookHandledListener
     *
     * @return void
     */
    public function testListenerIsCalledByCashierWebhookHandled()
    {
      // Get the user and the paylod
      [ $user, $payload ] = $this->getMockUserAndPayload(
        'TRIAL', 
        'customer.subscription.updated',
        'active'
      );

      // Make a call to the webhook URL
      $response = $this->postJson('/stripe/webhook', $payload);

      // Get and return the UserTasksheetSubscription
      $userTasksheetSubscription = UserTasksheetSubscription::where('userId', $user->id)->first();
      
      // Assert that the listener was called
      $this->assertSame('MONTHLY', $userTasksheetSubscription->type);
      $response->assertStatus(200);
    }

    /**
     * Test the listener's response to Stripe's "customer.subscription.updated" event
     *
     * @return void
     */
    public function testHandleCustomerSubscriptionUpdated()
    {
      [ $userTasksheetSubscription ] = $this->fireListener(
        'TRIAL',
        'customer.subscription.updated',
        'active'
      );
      $this->assertSame('MONTHLY', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'TRIAL',
        'customer.subscription.updated',
        'past_due'
      );
      $this->assertSame('TRIAL_EXPIRED', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'TRIAL_EXPIRED',
        'customer.subscription.updated',
        'active'
      );
      $this->assertSame('MONTHLY', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY',
        'customer.subscription.updated',
        'active'
      );
      $this->assertSame('MONTHLY', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY',
        'customer.subscription.updated',
        'past_due'
      );
      $this->assertSame('MONTHLY_PAST_DUE', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY',
        'customer.subscription.updated',
        'incomplete'
      );
      $this->assertSame('MONTHLY_PAST_DUE', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY',
        'customer.subscription.updated',
        'incomplete_expired'
      );
      $this->assertSame('MONTHLY_EXPIRED', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY_PAST_DUE',
        'customer.subscription.updated',
        'active'
      );
      $this->assertSame('MONTHLY', $userTasksheetSubscription->type);
    }

    /**
     * Test the listener's response to Stripe's "customer.subscription.deleted" event
     *
     * @return void
     */
    public function testHandleCustomerSubscriptionDeleted()
    {
      [ $userTasksheetSubscription ] = $this->fireListener(
        'TRIAL',
        'customer.subscription.deleted',
        'canceled'
      );
      $this->assertSame('TRIAL_EXPIRED', $userTasksheetSubscription->type);
      
      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY',
        'customer.subscription.deleted',
        'canceled'
      );
      $this->assertSame('MONTHLY_EXPIRED', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY',
        'customer.subscription.deleted',
        'incomplete_expired'
      );
      $this->assertSame('MONTHLY_EXPIRED', $userTasksheetSubscription->type);

      [ $userTasksheetSubscription ] = $this->fireListener(
        'MONTHLY_PAST_DUE',
        'customer.subscription.deleted',
        'canceled'
      );
      $this->assertSame('MONTHLY_EXPIRED', $userTasksheetSubscription->type);
    }
}
