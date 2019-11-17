<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SheetPriorityDropCellId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('sheetPriorities', function (Blueprint $table) {
        $table->dropForeign('sheetpriorities_cellid_foreign');
        $table->dropColumn('cellId');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('sheetPriorities', function (Blueprint $table) {
        $table->uuid('cellId');
        $table->foreign('cellId')->references('id')->on('sheetCells');
      });
    }
}
