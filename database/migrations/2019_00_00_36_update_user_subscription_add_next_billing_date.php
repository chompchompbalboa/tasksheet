<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserSubscriptionAddNextBillingDate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->timestamp('nextBillingDate')->nullable();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->dropColumn('nextBillingDate');
      });
    }
}
