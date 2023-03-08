import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-watcher'

import { HardhatUserConfig } from 'hardhat/config'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  networks: {
    localhost: {},
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY as any]
    }
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
      clearOnStart: true,
      runOnLaunch: true,
      start: 'echo Running my test task now..'
    }
  }
}

export default config
