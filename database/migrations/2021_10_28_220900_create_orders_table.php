<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('nr')->unique()->nullable();
            $table->date('date');
            $table->decimal('value', 18, 2); 
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->bigInteger('table_id')->unsigned()->nullable();
            $table->boolean('realized')->default(false);
            $table->integer('status')->unsigned();
            $table->boolean('is_paid')->default(false);
            $table->text('additional_informations')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('no action');
            $table->foreign('table_id')->references('id')->on('tables')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
