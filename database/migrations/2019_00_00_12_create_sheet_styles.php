<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetStyles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetStyles', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId');
          $table->json('backgroundColor')->nullable();
          $table->json('backgroundColorReference')->nullable();
          $table->json('bold')->nullable();
          $table->json('color')->nullable();
          $table->json('colorReference')->nullable();
          $table->json('italic')->nullable();
          $table->timestamps();

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
        Schema::dropIfExists('sheetStyles');
    }
}
