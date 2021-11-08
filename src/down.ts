import {
  IMigration,
  getMigrationsFromDatabase,
  logPotentialParseError
} from './helpers'
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
  const sortedMigrations = migrations.sort((a, b) => (a < b ? 1 : -1))
  const filteredMigrations = []
  for (let index = 0; index < steps; index++) {
    const migration = sortedMigrations.shift()
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
  try {
    console.info('Fetching database migrations')
    const migrations = await getMigrationsFromDatabase()

    const migrationsToRun = (await getMigrationsToRun(steps, migrations)).sort(
      (a, b) => (a.name < b.name ? 1 : -1)
    )

    console.info(
      `Running ${migrationsToRun.length} migrations: `,
      migrationsToRun.map(x => x.name)
    )

    for (let index = 0; index < migrationsToRun.length; index++) {
      const migrationToRun = migrationsToRun[index]
      await migrationToRun.down(Parse)
      await updateMigrationsTable(migrationToRun.name)
    }

    console.info(`Done running migrations.`)
  } catch (err) {
    if (!logPotentialParseError(err)) {
      console.error(err)
    }
  }
}

export default runMigrationsDown
