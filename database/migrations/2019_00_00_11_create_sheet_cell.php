<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetCell extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetCells', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId')->nullable();
          $table->uuid('columnId')->nullable();
          $table->uuid('rowId')->nullable();
          $table->text('value')->nullable();
          $table->json('style')->nullable();
          $table->timestamps();

          $table->foreign('sheetId')->references('id')->on('sheets');
          $table->foreign('columnId')->references('id')->on('sheetColumns');
          $table->foreign('rowId')->references('id')->on('sheetRows');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sheetCells');
    }
}
