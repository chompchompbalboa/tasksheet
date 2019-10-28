<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\Models\Team::class, function (Faker $faker) {
    return [
        'id' => '36faa7b2-79d3-11e9-8f9e-2a86e4085a59',
        'name' => $faker->company
    ];
});
