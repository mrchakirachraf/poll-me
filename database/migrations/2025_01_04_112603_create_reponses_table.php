<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reponses', function (Blueprint $table) {
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_question')->constrained('questions')->onDelete('cascade');
            $table->foreignId('id_option')->constrained('options')->onDelete('cascade');
            $table->primary(['id_user', 'id_question', 'id_option']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reponses');
    }
}
