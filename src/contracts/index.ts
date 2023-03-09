import { factories } from '@backend'
import { JsonRpcSigner } from '@ethersproject/providers'

import { Config } from '@/config'

const OurCloneFactory = new factories.contracts.OurCloneFactory__factory()
const OurGovernor = new factories.contracts.OurGovernor__factory()
const OurTimeLock = new factories.contracts.OurTimeLock__factory()
const OurVoteToken = new factories.contracts.OurVoteToken__factory()

export const getContracts = (config: Config, signer: JsonRpcSigner) => {
  const ourCloneFactory = OurCloneFactory.connect(signer).attach(
    config.ourCloneFactoryAddress
  )
  const ourGovernor = OurGovernor.connect(signer).attach(
    config.ourGovernorAddress
  )
  const ourTimeLock = OurTimeLock.connect(signer).attach(
    config.ourTimeLockAddress
  )
  const ourVoteToken = OurVoteToken.connect(signer).attach(
    config.ourVoteTokenAddress
  )

  return { ourCloneFactory, ourGovernor, ourTimeLock, ourVoteToken }
}
