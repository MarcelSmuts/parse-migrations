import fs from 'fs'

const dir = '/migrations'

function makeMigration (name: string) {
  try {
    const projectFolder = process.cwd()
    const date = new Date()
    const dateString = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`

    if (!fs.existsSync(`${projectFolder}/${dir}`)) {
      fs.mkdirSync(`${projectFolder}/${dir}`)
    }

    fs.writeFileSync(
      `${projectFolder}/${dir}/${dateString}-${name}.js`,
      `
  async function up () {}
  
  async function down () {}
  
  module.exports = { up, down }
  `
    )
  } catch (err) {
    console.error(err)
  }
}

export default makeMigration
