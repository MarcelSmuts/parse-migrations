import { IMigration, getMigrationsFromDatabase } from './helpers'
import Parse from 'parse/node'

async function updateMigrationsTable (name: string): Promise<void> {
  const query = new Parse.Query('migrations')
  query.equalTo('name', name)
  const item = await query.first()

  if (item) {
    await item.destroy()
  }
}

async function getMigrationsToRun (steps: number, migrations: string[]) {
  const filteredMigrations = []
  for (let index = 0; index < steps; index++) {
    const migration = migrations.pop()
    if (migration) {
      filteredMigrations.push(migration)
    }
  }

  const migrationsToRun: IMigration[] = []
  filteredMigrations.forEach(migrationToRunName => {
    const migration = require(`${process.cwd()}/migrations/${migrationToRunName}`)
    migrationsToRun.push({
      name: migrationToRunName,
      up: migration.up,
      down: migration.down
    })
  })

  return migrationsToRun
}

async function runMigrationsDown (steps: number): Promise<void> {
  console.info('Fetching database migrations')
  const migrations = await getMigrationsFromDatabase()

  const migrationsToRun = await getMigrationsToRun(steps, migrations)

  console.info(`Running ${migrationsToRun.length} migrations`)

  migrationsToRun.forEach(async migration => {
    await migration.down(Parse)

    await updateMigrationsTable(migration.name)
  })

  console.info(`Done running migrations.`)
}

export default runMigrationsDown
