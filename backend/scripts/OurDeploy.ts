import { Provider } from '@ethersproject/abstract-provider'
import { ethers } from 'hardhat'
import OurCloneFactory from '../artifacts/contracts/OurCloneFactory.sol/OurCloneFactory.json'
import OurGovernor from '../artifacts/contracts/OurGovernor.sol/OurGovernor.json'


async function main() {

  const getNextAddressFromFactory = async (number: any) => {
    return ethers.utils.getContractAddress({
      from: factoryInstance.address,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      nonce: number + 1
    })
  }

  const provider = ethers.getDefaultProvider('http://127.0.0.1:8545/')
  const owner = new ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',provider)

  const factoryInstance = new ethers.Contract('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',OurCloneFactory.abi,owner);

  let nonce = await provider.getTransactionCount(factoryInstance.address)

  console.log(nonce)
    

  console.log('First pre-determined address (timelock)')
  const determinedTimeLockAddress = await getNextAddressFromFactory(nonce-1)
  console.log('predetermined time ' + determinedTimeLockAddress)

  // console.log('Second pre-determined address (governor)')
  const determinedGovernorAddress = await getNextAddressFromFactory(nonce)
  console.log('predetermined gov ' + determinedGovernorAddress)
  // actual
  // console.log(await factoryInstance.getGovernorCloneFromArray(0))

  //console.log('Third pre-determined address (token)')
  const determinedTokenAddress = await getNextAddressFromFactory(nonce+1)
  console.log('predetermined token ' + determinedTokenAddress)
  // actual
  
  const daoName = 'ETHSD'
  const daoDescription = 'ETHSD'
  const votingDelay = 1
  const votingPeriod = 50400 // 1 sweek
  // const tokenName = 'OurToken'
  // const tokenSymbol = 'OUT'
  // const timelockDelay = 300 // 1 hour
  const quorumFraction = 1

  // const DAOtx = await factoryInstance.createDAO(
  //   determinedGovernorAddress,
  //   daoName,
  //   daoDescription,
  //   determinedTokenAddress,
  //   determinedTimeLockAddress,
  //   '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  //   votingDelay,
  //   votingPeriod,
  //   quorumFraction,
  //   'USDC',
  //   'USDC',
  //   {gasLimit: 30000000}
  // )

 // console.log(await DAOtx)
  //console.log(await factoryInstance.getDaos())

  const govStruct = await factoryInstance.getSpecificDAO(0)


  const voter = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  const voterP = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

  //const gov = govStruct.governor
  const gov = new ethers.Contract(govStruct.governor,OurGovernor.abi,voter)


  console.log(gov.connect(voter));

  console.log(gov.join(),voterP);


  //console.log(await factoryInstance.getArrayLength())



}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

