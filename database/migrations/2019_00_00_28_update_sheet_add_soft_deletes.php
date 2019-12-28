<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSheetAddSoftDeletes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      // Sheet
      Schema::table('sheets', function (Blueprint $table) {
        $table->softDeletes();
      });
      
      // SheetColumn
      Schema::table('sheetColumns', function (Blueprint $table) {
        $table->softDeletes();
      });

      // SheetRow
      Schema::table('sheetRows', function (Blueprint $table) {
        $table->softDeletes();
      });

      // SheetCell
      Schema::table('sheetCells', function (Blueprint $table) {
        $table->softDeletes();
      });

      // SheetView
      Schema::table('sheetViews', function (Blueprint $table) {
        $table->softDeletes();
      });

      // SheetFilter
      Schema::table('sheetFilters', function (Blueprint $table) {
        $table->softDeletes();
      });

      // SheetGroup
      Schema::table('sheetGroups', function (Blueprint $table) {
        $table->softDeletes();
      });

      // SheetSort
      Schema::table('sheetSorts', function (Blueprint $table) {
        $table->softDeletes();
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
      Schema::table('sheets', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });
      
      // SheetColumn
      Schema::table('sheetColumns', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });

      // SheetRow
      Schema::table('sheetRows', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });

      // SheetCell
      Schema::table('sheetCells', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });

      // SheetView
      Schema::table('sheetViews', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });

      // SheetFilter
      Schema::table('sheetFilters', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });

      // SheetGroup
      Schema::table('sheetGroups', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });

      // SheetSort
      Schema::table('sheetSorts', function (Blueprint $table) {
        $table->dropSoftDeletes();
      });
    }
}
