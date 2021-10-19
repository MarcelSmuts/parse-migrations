import Parse from 'parse/node'

interface IMigration {
  name: string
  up: Function
  down: Function
}

interface IParseError extends Error {
  code: number
}

async function getMigrationsFromDatabase (): Promise<string[]> {
  const migrationsQuery = new Parse.Query('migrations')
  let dbMigrations = await migrationsQuery.select('name').find()
  return dbMigrations.map(x => JSON.parse(JSON.stringify(x)).name)
}

export { IMigration, IParseError, getMigrationsFromDatabase }
