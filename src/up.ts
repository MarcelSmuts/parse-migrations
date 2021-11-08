const Parse = require('parse/node')
const fs = require('fs')
import {
  IParseError,
  IMigration,
  getMigrationsFromDatabase,
  logPotentialParseError
} from './helpers'

async function createMigrationsTable (): Promise<void> {
  try {
    const migrationsQuery = new Parse.Query('migrations')
    const dbMigrations = await migrationsQuery.find()
  } catch (err) {
    if ((err as IParseError).code === 119) {
      // The migrations table does not exist in schema. Create it
      const migrationsSchema = new Parse.Schema('migrations')
      migrationsSchema.addString('name')
      await migrationsSchema.save()
      return
    }

    throw err
  }
}

async function updateMigrationsTable (name: string): Promise<void> {
  const Migration = Parse.Object.extend('migrations')
  const migration = new Migration()

  migration.set('name', name)
  await migration.save()
}

async function removeRunMigrations (migrations: string[]) {
  const migrationsToRun: IMigration[] = []
  const migrationFileNames: string[] = []
  fs.readdirSync(process.cwd() + '/migrations').forEach(
    (migrationFileName: string) => {
      migrationFileNames.push(migrationFileName)
    }
  )

  migrationFileNames.forEach(fileName => {
    if (migrations.indexOf(fileName) > -1) {
      return
    }

    const migration = require(`${process.cwd()}/migrations/${fileName}`)
    migrationsToRun.push({
      name: fileName,
      up: migration.up,
      down: migration.down
    })
  })

  return migrationsToRun
}

async function runMigrationsUp (): Promise<void> {
  try {
    await createMigrationsTable()

    console.info('Fetching database migrations')
    const migrations = await getMigrationsFromDatabase()

    const migrationsToRun = (await removeRunMigrations(migrations)).sort(
      (a, b) => (a.name > b.name ? 1 : -1)
    )

    console.info(
      `Found ${migrationsToRun.length} migrations: `,
      migrationsToRun.map(x => x.name)
    )

    for (let index = 0; index < migrationsToRun.length; index++) {
      const migrationToRun = migrationsToRun[index]
      await migrationToRun.up(Parse)
      await updateMigrationsTable(migrationToRun.name)
    }

    console.info(`Done running migrations.`)
  } catch (err) {
    if (!logPotentialParseError(err)) {
      console.error(err)
    }
  }
}

export default runMigrationsUp
