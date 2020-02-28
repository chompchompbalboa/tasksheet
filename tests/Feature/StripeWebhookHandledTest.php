<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use Laravel\Cashier\Events\WebhookHandled;
use App\Listeners\StripeWebhookHandled;

class StripeWebhookHandledTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testHandle()
    {
      $listener = new StripeWebhookHandled();
      $listener->handle(new WebhookHandled($this->getMockPayload('invoice.payment_failed')));
      $this->assertSame(true, false);
    }

    private function getMockPayload(string $type = 'invoice.payment_succeeded')
    {
      return [
        'type' => $type
      ];
    }
}
