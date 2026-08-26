// Runs the pincode API and the Vite dev server together, so `npm start` is all
// that is needed to bring the site up on localhost.
import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = []
let shuttingDown = false

function run(name, script) {
  const child = spawn(npm, ['run', script], { stdio: 'inherit', shell: process.platform === 'win32' })

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }
    console.error(`\n[${name}] exited (${signal ?? code}). Shutting down.`)
    shutdown(code ?? 1)
  })

  children.push(child)
}

function shutdown(code) {
  if (shuttingDown) {
    return
  }
  shuttingDown = true

  for (const child of children) {
    child.kill()
  }

  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

run('api', 'api')
run('web', 'dev')
