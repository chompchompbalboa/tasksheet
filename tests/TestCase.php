<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use Tests\Traits\MigrateAndSeedDatabaseOnceBeforeAllTests;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, MigrateAndSeedDatabaseOnceBeforeAllTests;
}
