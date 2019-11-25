<?php

$factory->define(App\Models\UserSubscription::class, function () {
    return [
        'type' => 'LIFETIME',
    ];
});
