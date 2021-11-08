import Parse from 'parse/node'

interface IMigration {
  name: string
  up: Function
  down: Function
}

interface IParseError extends Error {
  code: number
}

function logPotentialParseError (err: unknown): Boolean {
  if ((err as IParseError).code) {
    console.error(
      'Parse Error: ',
      (err as IParseError).name,
      (err as IParseError).code,
      (err as IParseError).message
    )
    return true
  }

  return false
}

async function getMigrationsFromDatabase (): Promise<string[]> {
  const migrationsQuery = new Parse.Query('migrations')
  let dbMigrations = await migrationsQuery.select('name').find()
  return dbMigrations
    .map(x => JSON.parse(JSON.stringify(x)).name)
    .sort()
    .reverse()
}

export {
  IMigration,
  IParseError,
  getMigrationsFromDatabase,
  logPotentialParseError
}
