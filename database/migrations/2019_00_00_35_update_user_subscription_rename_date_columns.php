<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserSubscriptionRenameDateColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('startDate', 'subscriptionStartDate');
      });

      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('endDate', 'subscriptionEndDate');
      });

      Schema::table('userSubscription', function (Blueprint $table) {
        $table->timestamp('trialStartDate')->nullable();
        $table->timestamp('trialEndDate')->nullable();
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
        $table->renameColumn('subscriptionStartDate', 'startDate');
      });

      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('subscriptionEndDate', 'endDate');
      });

      Schema::table('userSubscription', function (Blueprint $table) {
        $table->dropColumn([ 'trialStartDate', 'trialEndDate' ]);
      });
    }
}
