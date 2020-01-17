<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSheetCellChangeMakeValueNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      // Sheet
      Schema::table('sheetCellChanges', function (Blueprint $table) {
        $table->string('value')->nullable()->change();
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
      Schema::table('sheetCellChanges', function (Blueprint $table) {
        $table->string('value')->nullable(false)->change();
      });
    }
}
