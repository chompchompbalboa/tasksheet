<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserColor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userColor', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('userId');
            $table->string('primary')->nullable();
            $table->string('secondary')->nullable();
            $table->string('tertiary')->nullable();
            $table->timestamps();

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
        Schema::dropIfExists('userColor');
    }
}
