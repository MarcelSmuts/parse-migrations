import runMigrationsUp from './up'
import runMigrationsDown from './down'
import makeMigration from './make'
import Parse from 'parse/node'

interface ParseConfiguration {
  javascriptKey?: string | undefined
  applicationId: string
  masterKey?: string | undefined
  serverURL: string
}

function initParse (parseConfig: ParseConfiguration) {
  Parse.initialize(parseConfig.applicationId, parseConfig.javascriptKey)
  Parse.serverURL = parseConfig.serverURL
  Parse.masterKey = parseConfig.masterKey
}

class ParseMigrations {
  parseConfig: ParseConfiguration

  constructor (parseConfiguration: ParseConfiguration) {
    this.parseConfig = parseConfiguration
  }

  up () {
    initParse(this.parseConfig)
    runMigrationsUp()
  }

  down (steps: number) {
    initParse(this.parseConfig)
    runMigrationsDown(steps)
  }

  make (name: string) {
    makeMigration(name)
  }
}

export = ParseMigrations
