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
      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('startDate', 'subscriptionStartDate');
      });

      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('endDate', 'subscriptionEndDate');
      });

      // Sheet
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
      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('subscriptionStartDate', 'startDate');
      });

      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->renameColumn('subscriptionEndDate', 'endDate');
      });

      // Sheet
      Schema::table('userSubscription', function (Blueprint $table) {
        $table->dropColumn([ 'trialStartDate', 'trialEndDate' ]);
      });
    }
}
