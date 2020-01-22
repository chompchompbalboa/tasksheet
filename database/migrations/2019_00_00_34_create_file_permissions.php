<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilePermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('filePermissions', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('fileId');
          $table->uuid('userId');
          $table->string('role');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

          $table->foreign('fileId')->references('id')->on('files');
          $table->foreign('userId')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('filePermissions', function (Blueprint $table) {
        $table->dropForeign('filepermissions_fileid_foreign');
        $table->dropForeign('filepermissions_userid_foreign');
      });

      Schema::dropIfExists('filePermissions');
    }
}
