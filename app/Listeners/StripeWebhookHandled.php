<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookHandled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class StripeWebhookHandled
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
      $eventType = $event->payload['type'];
      if($eventType === 'invoice.payment_succeeded') {
        $this->handleInvoicePaymentSucceeded();
      }
      if($eventType === 'invoice.payment_failed') {
        $this->handleInvoicePaymentFailed();
      }
    }

    private function handleInvoicePaymentFailed()
    {
      dd('Uh oh!');
    }

    private function handleInvoicePaymentSucceeded()
    {
      dd('Yay!');
    }
}
