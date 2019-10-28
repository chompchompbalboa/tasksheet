<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetDropdown extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetDropdowns', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('teamId')->nullable();
          $table->uuid('userId')->nullable();
          $table->uuid('sheetId')->nullable();
          $table->string('name');
          $table->timestamps();

          $table->foreign('teamId')->references('id')->on('teams');
          $table->foreign('userId')->references('id')->on('users');
          $table->foreign('sheetId')->references('id')->on('sheets');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sheetDropdowns');
    }
}
