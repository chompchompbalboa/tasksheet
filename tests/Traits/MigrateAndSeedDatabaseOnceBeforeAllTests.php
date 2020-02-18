<?php

namespace Tests\Traits;

use \Illuminate\Database\SQLiteConnection;  
use \Illuminate\Database\Schema\{SQLiteBuilder, Blueprint}; 
use Illuminate\Support\Facades\Artisan;
use \Illuminate\Support\Fluent; 

trait MigrateAndSeedDatabaseOnceBeforeAllTests
{
    /**
    * If true, setup has run at least once.
    * @var boolean
    */
    protected static $setUpHasRunOnce = false;
  
    /**
    * After the first run of setUp "migrate:fresh --seed"
    * @return void
    */
    public function setUp(): void
    {
      parent::setUp();
      if (!static::$setUpHasRunOnce) {
        $this->hotfixSqlite();
        Artisan::call('migrate:fresh');
        Artisan::call(
            'db:seed', ['--class' => 'DatabaseSeeder']
        );
        static::$setUpHasRunOnce = true;
       }
    }
  
    /**
     * Hot Fix Sqlite
     *
     * Sqlite doesn't allow foreign keys to be dropped. Our migrations drop 
     * foreign keys. This hotfixes the issue. This solution was found here:
     * https://github.com/laravel/framework/issues/25475
     */
    public function hotfixSqlite()
    {
      \Illuminate\Database\Connection::resolverFor('sqlite', function ($connection, $database, $prefix, $config) {
        return new class($connection, $database, $prefix, $config) extends SQLiteConnection {
          public function getSchemaBuilder()
          {
            if ($this->schemaGrammar === null) {
                $this->useDefaultSchemaGrammar();
            }
            return new class($this) extends SQLiteBuilder {
              protected function createBlueprint($table, \Closure $callback = null)
              {
                return new class($table, $callback) extends Blueprint {
                  public function dropForeign($index)
                  {
                    return new Fluent();
                  }
                };
              }
            };
          }
        };
      });
  }
}