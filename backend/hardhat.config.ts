import '@tenderly/hardhat-tenderly'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-watcher'

import { HardhatUserConfig } from 'hardhat/config'

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
