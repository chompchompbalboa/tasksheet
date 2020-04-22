<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetCellLabel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetCellLabels', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId');
          $table->uuid('columnId');
          $table->uuid('rowId');
          $table->uuid('cellId');
          $table->string('value');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();
          $table->softDeletes();

          $table->foreign('sheetId')->references('id')->on('sheets');
          $table->foreign('columnId')->references('id')->on('sheetColumns');
          $table->foreign('rowId')->references('id')->on('sheetRows');
          $table->foreign('cellId')->references('id')->on('sheetCells');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sheetCellLabels');
    }
}
