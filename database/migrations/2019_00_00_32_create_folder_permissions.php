<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFolderPermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('folderPermissions', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('folderId');
          $table->uuid('userId');
          $table->string('role');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

          $table->foreign('folderId')->references('id')->on('folders');
          $table->foreign('userId')->references('id')->on('users');
        });

        Schema::table('users', function (Blueprint $table) {
          $table->dropForeign('users_folderid_foreign');
          $table->dropColumn('folderId');
        });

        Schema::table('teams', function (Blueprint $table) {
          $table->dropForeign('teams_folderid_foreign');
        });

        Schema::table('teamUsers', function (Blueprint $table) {
          $table->dropForeign('teamusers_teamid_foreign');
          $table->dropForeign('teamusers_userid_foreign');
        });

        Schema::dropIfExists('teams');
        Schema::dropIfExists('teamUsers');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('folderPermissions', function (Blueprint $table) {
        $table->dropForeign('folderpermissions_folderid_foreign');
        $table->dropForeign('folderpermissions_userid_foreign');
      });

      Schema::dropIfExists('folderPermissions');

      Schema::table('users', function (Blueprint $table) {
        $table->uuid('folderId')->nullable();
        $table->foreign('folderId')->references('id')->on('folders');
      });

      Schema::create('teams', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->string('name');
          $table->uuid('folderId')->nullable();
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

          $table->foreign('folderId')->references('id')->on('folders');
      });

      Schema::create('teamUsers', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->uuid('teamId');
          $table->uuid('userId');
          $table->timestamp('createdAt')->nullable();
          $table->timestamp('updatedAt')->nullable();

          $table->foreign('teamId')->references('id')->on('teams');
          $table->foreign('userId')->references('id')->on('users');
      });
    }
}
