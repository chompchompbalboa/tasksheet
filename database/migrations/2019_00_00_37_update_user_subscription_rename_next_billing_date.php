<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserSubscriptionRenameNextBillingDate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('nextBillingDate', 'billingDayOfMonth');
      });

      Schema::table('userSubscription', function (Blueprint $table) {
        $table->integer('billingDayOfMonth')->change();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('billingDayOfMonth', 'subscriptionStartDate');
      });

      Schema::table('userSubscription', function (Blueprint $table) {
        $table->timestamps('subscriptionStartDate')->change();
      });
    }
}
