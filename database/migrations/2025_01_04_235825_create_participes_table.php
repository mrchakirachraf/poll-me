<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participes', function (Blueprint $table) {
            $table->id('id_participation'); // Primary key
            $table->unsignedBigInteger('id_user'); // Foreign key to users
            $table->unsignedBigInteger('id_sondage'); // Foreign key to sondages
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_sondage')->references('id_sondage')->on('sondages')->onDelete('cascade');

            // Prevent duplicate participation
            $table->unique(['id_user', 'id_sondage']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('participes');
    }
}
