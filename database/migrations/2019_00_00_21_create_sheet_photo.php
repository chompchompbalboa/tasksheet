<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetPhoto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetPhotos', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('sheetId');
          $table->uuid('cellId');
          $table->string('filename');
          $table->uuid('s3Uuid');
          $table->string('s3Bucket');
          $table->string('s3Key');
          $table->string('uploadedBy');
          $table->datetime('uploadedAt');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

          $table->foreign('sheetId')->references('id')->on('sheets');
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
        Schema::dropIfExists('sheetPhotos');
    }
}
