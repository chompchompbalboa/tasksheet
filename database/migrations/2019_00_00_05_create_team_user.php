<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeamUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teamUsers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('teamId');
            $table->uuid('userId');
            $table->timestamps();

            $table->foreign('teamId')->references('id')->on('teams');
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
        Schema::dropIfExists('teamUsers');
    }
}
