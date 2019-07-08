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

$factory->define(App\Models\UserColor::class, function (Faker $faker) {
    return [
        'primary' => 'rgb(28, 27, 39)',
        'secondary' => 'rgb(224, 131, 45)'
    ];
});
