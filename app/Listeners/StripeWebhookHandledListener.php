<?php

namespace App\Listeners;

use Carbon\Carbon;

use Laravel\Cashier\Events\WebhookHandled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\Models\User;
use App\Models\UserTasksheetSubscription;

class StripeWebhookHandledListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  WebhookHandled  $event
     * @return void
     */
    public function handle(WebhookHandled $event)
    { 
      // The event payload ($event->payload) is the Stripe Event object 
      // (https://stripe.com/docs/api/events/object)
      $stripeEvent = $event->payload;
      if($stripeEvent['type'] === 'customer.subscription.updated') {
        $this->handleCustomerSubscriptionUpdated($stripeEvent);
      }
      if($stripeEvent['type'] === 'customer.subscription.deleted') {
        $this->handleCustomerSubscriptionDeleted($stripeEvent);
      }
    }

    /**
     * Get the User from the Stripe Event 
     *
     * @return User $user
     */
    private function getUserTasksheetSubscriptionFromStripeEvent($payload) { 
      $userStripeId = $payload['data']['object']['customer'];
      if($user = User::where('stripe_id', $userStripeId)->first()) {
        if($userTasksheetSubscription = UserTasksheetSubscription::where('userId', $user->id)->first()) {
          return $userTasksheetSubscription;
        }
        return null;
      }
      return null;
    }

    /**
     * Get the customer status from the Stripe Event 
     *
     * @return void
     */
    private function getCustomerStatusFromStripeEvent($payload) { 
      return $payload['data']['object']['status'];
    }


    /**
     * Handle Stripe's "customer.subscription.updated" event
     *
     * @return void
     */
    private function handleCustomerSubscriptionUpdated($stripeEvent)
    {
      // Get the User and the Stripe customer status
      $userTasksheetSubscription = $this->getUserTasksheetSubscriptionFromStripeEvent($stripeEvent);
      $stripeCustomerStatus = $this->getCustomerStatusFromStripeEvent($stripeEvent);
      $currentDate = Carbon::now();
      if(isset($userTasksheetSubscription, $stripeCustomerStatus)) {
        // TRIAL
        if($userTasksheetSubscription->type === 'TRIAL') {
          if($stripeCustomerStatus === 'active') {
            $userTasksheetSubscription->type = 'MONTHLY';
            $userTasksheetSubscription->billingDayOfMonth = $currentDate->day;
            $userTasksheetSubscription->subscriptionStartDate = $currentDate;
            $userTasksheetSubscription->subscriptionEndDate = null;
          }
          if($stripeCustomerStatus === 'past_due') {
            $userTasksheetSubscription->type = 'TRIAL_EXPIRED';
          }
        }
        // TRIAL_EXPIRED
        if($userTasksheetSubscription->type === 'TRIAL_EXPIRED') {
          if($stripeCustomerStatus === 'active') {
            $userTasksheetSubscription->type = 'MONTHLY';
            $userTasksheetSubscription->billingDayOfMonth = $currentDate->day;
            $userTasksheetSubscription->subscriptionStartDate = $currentDate;
            $userTasksheetSubscription->subscriptionEndDate = null;
          }
        }
        // MONTHLY
        if($userTasksheetSubscription->type === 'MONTHLY') {
          if($stripeCustomerStatus === 'past_due') {
            $userTasksheetSubscription->type = 'MONTHLY_PAST_DUE';
          }
          if($stripeCustomerStatus === 'incomplete') {
            $userTasksheetSubscription->type = 'MONTHLY_PAST_DUE';
          }
          if($stripeCustomerStatus === 'incomplete_expired') {
            $userTasksheetSubscription->type = 'MONTHLY_EXPIRED';
            $userTasksheetSubscription->subscriptionEndDate = $currentDate;
          }
        }
        // MONTHLY_PAST_DUE
        if($userTasksheetSubscription->type === 'MONTHLY_PAST_DUE') {
          if($stripeCustomerStatus === 'active') {
            $userTasksheetSubscription->type = 'MONTHLY';
            $userTasksheetSubscription->billingDayOfMonth = $currentDate->day;
            $userTasksheetSubscription->subscriptionStartDate = $currentDate;
            $userTasksheetSubscription->subscriptionEndDate = null;
          }
        }
      }
      $userTasksheetSubscription->save();
    }

    /**
     * Handle Stripe's "customer.subscription.deleted" event
     *
     * @return void
     */
    private function handleCustomerSubscriptionDeleted($stripeEvent)
    {
      // Get the User and the Stripe customer status
      $userTasksheetSubscription = $this->getUserTasksheetSubscriptionFromStripeEvent($stripeEvent);
      $stripeCustomerStatus = $this->getCustomerStatusFromStripeEvent($stripeEvent);
      $currentDate = Carbon::now();
      if(isset($userTasksheetSubscription, $stripeCustomerStatus)) {
        // TRIAL
        if($userTasksheetSubscription->type === 'TRIAL') {
          if($stripeCustomerStatus === 'canceled') {
            $userTasksheetSubscription->type = 'TRIAL_EXPIRED';
          }
        }
        // MONTHLY
        if($userTasksheetSubscription->type === 'MONTHLY') {
          if($stripeCustomerStatus === 'canceled') {
            $userTasksheetSubscription->type = 'MONTHLY_EXPIRED';
            $userTasksheetSubscription->billingDayOfMonth = null;
            $userTasksheetSubscription->subscriptionEndDate = $currentDate;
          }
          if($stripeCustomerStatus === 'incomplete_expired') {
            $userTasksheetSubscription->type = 'MONTHLY_EXPIRED';
            $userTasksheetSubscription->billingDayOfMonth = null;
            $userTasksheetSubscription->subscriptionEndDate = $currentDate;
          }
        }
        // MONTHLY_PAST_DUE
        if($userTasksheetSubscription->type === 'MONTHLY_PAST_DUE') {
          if($stripeCustomerStatus === 'canceled') {
            $userTasksheetSubscription->type = 'MONTHLY_EXPIRED';
            $userTasksheetSubscription->billingDayOfMonth = null;
            $userTasksheetSubscription->subscriptionEndDate = $currentDate;
          }
        }
      }
      $userTasksheetSubscription->save();
    }
}
