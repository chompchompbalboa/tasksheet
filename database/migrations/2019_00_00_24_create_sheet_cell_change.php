<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetCellChange extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetCellChanges', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId');
          $table->uuid('columnId');
          $table->uuid('rowId');
          $table->uuid('cellId');
          $table->string('value');
          $table->string('createdBy');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

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
        Schema::dropIfExists('sheetCellChanges');
    }
}
