import { asObject, asString } from 'cleaners'

export const asConfig = asObject({
  // API Keys:
  magicLinkApiKey: asString,
  // Contract address:
  ourCloneFactoryAddress: asString,
  ourGovernorAddress: asString,
  ourTimeLockAddress: asString,
  ourVoteTokenAddress: asString,
  paymentTokenAddress: asString
})
export type Config = ReturnType<typeof asConfig>
