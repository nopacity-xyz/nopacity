import { Magic } from 'magic-sdk'

import { Config } from '@/config'

export function getMagic(config: Config) {
  return new Magic(config.magicLinkApiKey, {
    // network: 'goerli'
    network: {
      rpcUrl: 'https://498f-2603-8000-3703-51f4-bc4f-62a2-7bff-8e1a.ngrok.io',
      chainId: 31337
    }
  })
}
