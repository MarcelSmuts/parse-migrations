# Description

A simple database migrator for Parse Platform

# Usage

```
const ParseMigrations = require('parse-migrations')

// Takes in a parse config object. Requires applicationId, masterKey, serverURL
const migrator = new ParseMigrations(parseConfigObject)

// Create new migration in the migrations folder
migrator.make('newMigration')

// Runs all migrations that are not present in the migrations table
migrator.up()

// Run X DOWN migrations where X is the number of migrations
migrator.down(X)
```

# How it works

First checks for any files in the migrations folder.
Will then check for existing migrations in migrations table and will not re-run those scripts.
Once migrations have been run, they will be added to the migrations table for later
