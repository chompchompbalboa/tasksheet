<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetGanttRange extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetGanttRanges', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId');
          $table->uuid('sheetGanttId');
          $table->uuid('columnId');
          $table->uuid('startDateColumnId');
          $table->uuid('endDateColumnId')->nullable();
          $table->string('backgroundColor')->nullable();
          $table->timestamp('createdAt');
          $table->timestamp('updatedAt');
          $table->softDeletes();

          $table->foreign('sheetId')->references('id')->on('sheets');
          $table->foreign('columnId')->references('id')->on('sheetColumns');
          $table->foreign('sheetGanttId')->references('id')->on('sheetGantts');
          $table->foreign('startDateColumnId')->references('id')->on('sheetColumns');
          $table->foreign('endDateColumnId')->references('id')->on('sheetColumns');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sheetGanttRanges');
    }
}
