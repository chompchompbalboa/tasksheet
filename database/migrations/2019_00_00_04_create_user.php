<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->uuid('organizationId')->nullable();
            $table->uuid('folderId');
            $table->uuid('userColorsId');
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('organizationId')->references('id')->on('organizations');
            $table->foreign('folderId')->references('id')->on('folders');
            $table->foreign('userColorsId')->references('id')->on('userColors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
