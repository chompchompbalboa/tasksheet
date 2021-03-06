<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetFilter extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetFilters', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId')->nullable();
          $table->uuid('sheetViewId')->nullable();
          $table->uuid('columnId');
          $table->string('type');
          $table->string('value');
          $table->boolean('isLocked');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

          $table->foreign('sheetId')->references('id')->on('sheets');
          $table->foreign('sheetViewId')->references('id')->on('sheetViews');
          $table->foreign('columnId')->references('id')->on('sheetColumns');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sheetFilters');
    }
}
