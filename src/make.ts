import fs from 'fs'

const dir = '/migrations'

function padString (str: string) {
  return str.padStart(2, '0')
}

function makeMigration (name: string) {
  try {
    const projectFolder = process.cwd()
    const date = new Date()
    const year = date.getFullYear()
    const month = padString(date.getMonth().toString())
    const day = padString(date.getDate().toString())
    const hours = padString(date.getHours().toString())
    const minutes = padString(date.getMinutes().toString())
    const seconds = padString(date.getSeconds().toString())
    const dateString = `${year}${month}${day}${hours}${minutes}${seconds}`

    if (!fs.existsSync(`${projectFolder}/${dir}`)) {
      fs.mkdirSync(`${projectFolder}/${dir}`)
    }

    fs.writeFileSync(
      `${projectFolder}/${dir}/${dateString}-${name}.js`,
      `
      async function up (ParseContext) {}
  
      async function down (ParseContext) {}
  
      module.exports = { up, down }
  `
    )
  } catch (err) {
    console.error(err)
  }
}

export default makeMigration
