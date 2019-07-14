<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetColumns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sheetId')->nullable();
            $table->string('name')->nullable();
            $table->string('type');
            $table->unsignedInteger('position');
            $table->float('width');
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
        Schema::dropIfExists('sheetColumns');
    }
}
