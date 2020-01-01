<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteSheetCellDropdown extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::dropIfExists('sheetCellDropdowns');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::create('sheetCellDropdowns', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->uuid('sheetId')->nullable();
        $table->uuid('cellId')->nullable();
        $table->string('value');
        $table->timestamp('createdAt')->nullable();
        $table->timestamp('updatedAt')->nullable();

        $table->foreign('cellId')->references('id')->on('sheetCells');
        $table->foreign('sheetId')->references('id')->on('sheets');
      });
    }
}
