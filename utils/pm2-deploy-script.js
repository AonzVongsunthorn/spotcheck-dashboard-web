// eslint-disable-next-line @typescript-eslint/no-var-requires
const cmd = require('node-cmd')
cmd.run('npx kill-port 8081')
cmd.run('npm run preview')
