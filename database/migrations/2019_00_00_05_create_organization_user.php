<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrganizationUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organizationUsers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organizationId');
            $table->uuid('userId');
            $table->timestamps();

            $table->foreign('organizationId')->references('id')->on('organizations');
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
        Schema::dropIfExists('organizationUsers');
    }
}
