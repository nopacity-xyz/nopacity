import { loadFixture, mine } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'

const { parseEther } = ethers.utils

const daoName = 'ETHSD'
const votingDelay = 1
const votingPeriod = 50400 // 1 week
const tokenName = 'OurToken'
const tokenSymbol = 'OUT'
const timelockDelay = 300 // 1 hour
const qourumFraction = 1
describe('TESTING GOVERNOR CONTRACT', function () {
  it('SUPER TEST', async function () {
    const [owner, ...voters] = await ethers.getSigners()

    // Skeleton Governor
    const Governor = await ethers.getContractFactory('OurGovernor')
    const governor = await Governor.deploy()
    await governor.deployed()

    console.log(`Skeleton Governor deployed to ${governor.address}`)

    const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
    const cloneFactory = await OurCloneFactory.deploy(governor.address)
    await cloneFactory.deployed()

    console.log(`Clone Factory deployed to ${cloneFactory.address}`)

    // Factory Instance using the Clone Factory address
    const factoryInstance = await OurCloneFactory.attach(cloneFactory.address)

    // actually Creating Govenor
    // const deployedGovernor = await factoryInstance.createNewGovernor(
    //   daoName,
    //   governor.address,
    //   governor.address,
    //   governor.address,
    //   votingDelay,
    //   votingPeriod,
    //   qourumFraction
    // )

    //
    // Helpers
    //

    const getNextContractAddress = async (extraOffset: number = 0) => {
      return ethers.utils.getContractAddress({
        from: owner.address,
        nonce: (await owner.getTransactionCount()) + 1 + extraOffset
      })
    }

    const number = (await factoryInstance.getArrayLength()).toNumber()

    const getNextAddressFromFactory = async (extraOffset: number = 0) => {
      return ethers.utils.getContractAddress({
        from: factoryInstance.address,
        nonce: 0
      })
    }

    //
    // Test ERC20 Token
    //

    const PaymentToken = await ethers.getContractFactory('TestPaymentToken')
    const paymentToken = await PaymentToken.connect(owner).deploy()
    await paymentToken.deployed()

    for (let i = 0; i < 5; ++i) {
      await paymentToken
        .connect(owner)
        .transfer(voters[i].address, parseEther('1000'))
    }

    //
    // Deploy Timelock
    //

    const governorContractAddress = await getNextAddressFromFactory()
    const TimeLockContract = await ethers.getContractFactory(
      'MyTimelockController'
    )
    const timeLockContract = await TimeLockContract.deploy(
      timelockDelay,
      [governorContractAddress],
      ['0x0000000000000000000000000000000000000000', governorContractAddress],
      owner.address,
      parseEther('100'),
      { gasLimit: 30000000 }
    )
    await timeLockContract.deployed()

    //
    // Deploy Governor
    //

    const tokenContractAddress = await getNextContractAddress()
    // const GovernorContract = await ethers.getContractFactory('OurCloneFactory')
    // const governorContract = await GovernorContract.deploy(
    //   daoName,
    //   tokenContractAddress,
    //   timeLockContract.address,
    //   paymentToken.address,
    //   votingDelay,
    //   votingPeriod,
    //   qourumFraction,
    //   { gasLimit: 30000000 }
    // )
    // await governorContract.deployed()

    const deployedGovernor = await factoryInstance.createNewGovernor(
      daoName,
      tokenContractAddress,
      timeLockContract.address,
      paymentToken.address,
      votingDelay,
      votingPeriod,
      qourumFraction
    )

    const governorContract = await factoryInstance.getCloneFromArray()

    //
    // Deploy Token
    //

    const TokenContract = await ethers.getContractFactory('TokenContract')
    const tokenContract = await TokenContract.deploy(
      governorContract,
      tokenName,
      tokenSymbol,
      { gasLimit: 30000000 }
    )
    await tokenContract.deployed()

    // Let the owner mint his own NFT
    await tokenContract.safeMint(owner.address)
    await tokenContract.safeMint(voters[0].address)
    // Transfer the ownership of the token to the governor contract
    await tokenContract.transferOwnership(governorContract.address)

    // Debugging Logs:
    // console.log('Payment Token:', paymentToken.address)
    // console.log('Owner:', owner.address)
    // console.log('Voter:', voters[0].address)
    // console.log('Token Contract: ' + tokenContract.address)
    // console.log('Time Lock: ' + timeLockContract.address)
    // console.log('Governor Contract: ' + governorContract.address)

    //   return {
    //     paymentToken,
    //     timeLockContract,
    //     governorContract,
    //     tokenContract,
    //     owner,
    //     voters
    //   }
    // predetermined
    console.log('HEREEEEE?????')
    console.log(getNextAddressFromFactory())
    // actual
    console.log(await factoryInstance.getCloneFromArray())
  })
})

// describe('Testing of the governor and Token Contract ', function () {
//   it('should have a TEST ERC20 token deployed', async () => {
//     const { paymentToken } = await loadFixture(deployFixture)

//     const supply = await paymentToken.totalSupply()
//     assert(supply.gt('1'))
//   })

//   it('should provide the owner with an ERC721 token after they deploy', async () => {
//     const { tokenContract, owner } = await loadFixture(deployFixture)

//     // Owner should have a vote token :
//     const votersTokenBalance = await tokenContract
//       .connect(owner)
//       .balanceOf(owner.address)
//     expect(votersTokenBalance.toString()).equal('1')

//     // Should automatically delegate vote to self token:
//     const ownerDelegate = await tokenContract.delegates(owner.address)
//     expect(ownerDelegate).equal(owner.address)
//   })

//   it('voter can join DAO', async () => {
//     const { governorContract, paymentToken, tokenContract, voters } =
//       await loadFixture(deployFixture)
//     const [voter] = voters

//     // Voter must pay before joining
//     await paymentToken
//       .connect(voter)
//       .approve(governorContract.address, parseEther('100'))
//     // Vote joins
//     await governorContract.connect(voter).join()

//     // Voter should have a vote token
//     const votersTokenBalance = await tokenContract.balanceOf(voter.address)
//     expect(votersTokenBalance.toString()).equal('1')

//     // Should automatically delegate vote to self token:
//     const voterDelegate = await tokenContract.delegates(voter.address)
//     expect(voterDelegate).equal(voter.address)
//   })

//   it('voter must pay the minimum to join DAO', async () => {
//     const {
//       governorContract,
//       voters: [voter]
//     } = await loadFixture(deployFixture)

//     // await usdcTokenContract.approve(governorContract.address, '100')
//     await expect(governorContract.connect(voter).join()).to.revertedWith(
//       'Must pay the minimum'
//     )
//   })
// })

// describe('Proposal and vote workflow', function () {
//   const proposalAmount = ethers.utils.parseEther('10')

//   let fixtures: Awaited<ReturnType<typeof deployFixture>>
//   let descriptionHash: string
//   let proposalId: string
//   let target: string
//   let calldata: string
//   let description: string

//   this.beforeAll(async () => {
//     fixtures = await loadFixture(deployFixture)
//   })

//   it('voter can join DAO', async () => {
//     const { governorContract, paymentToken, tokenContract, voters } = fixtures
//     const [voter] = voters

//     // Voter must pay before joining
//     await paymentToken
//       .connect(voter)
//       .approve(governorContract.address, parseEther('100'))
//     // Vote joins
//     await governorContract.connect(voter).join()

//     // Voter should have a vote token
//     const votersTokenBalance = await tokenContract.balanceOf(voter.address)
//     expect(votersTokenBalance.toString()).equal('1')

//     // Should automatically delegate vote to self token:
//     const voterDelegate = await tokenContract.delegates(voter.address)
//     expect(voterDelegate).equal(voter.address)
//   })
//   it('owner can create proposal', async () => {
//     const { governorContract, owner, paymentToken, voters } = fixtures
//     const [voter] = voters
//     // Prepare proposal payload:
//     target = paymentToken.address
//     calldata = paymentToken.interface.encodeFunctionData('transfer', [
//       voter.address,
//       proposalAmount
//     ])
//     description = 'This is to pay one of the voters to fill a pothole'
//     descriptionHash = ethers.utils.id(description)

//     // Make proposal:
//     const tx = await governorContract
//       .connect(owner)
//       .propose([target], [0], [calldata], description)
//     const receipt = await tx.wait()
//     const event = (receipt.events ?? [])[0]

//     // Typescript type assertions:
//     if (event == null) throw new Error('Expected event')
//     if (event.eventSignature == null)
//       throw new Error('Expected event signature')
//     if (event.data == null) throw new Error('Expected event data')
//     if (event.decode == null) throw new Error('Expected event decode')

//     // Get proposalId
//     const eventData = event.decode(event.data, event.topics)
//     proposalId = eventData.proposalId
//   })
//   it('Should allow the delegates to vote on proposal', async () => {
//     const { governorContract, owner, voters } = fixtures
//     const [voter] = voters

//     // mine a block for the proposal to pass the voting delay
//     await mine(votingDelay)

//     const voteTx = await governorContract.connect(voter).castVote(proposalId, 1)
//     const ownerVoteTx = await governorContract
//       .connect(owner)
//       .castVote(proposalId, 1)
//     await voteTx.wait()
//     await ownerVoteTx.wait()
//   })

//   it('Should execute a proposal', async () => {
//     const { governorContract, voters, paymentToken } = fixtures
//     const [voter] = voters
//     await mine(votingPeriod)

//     const beforeBalance = await paymentToken.balanceOf(voter.address)

//     await governorContract
//       .connect(voter)
//       .queue([target], [0], [calldata], descriptionHash)

//     // Wait until timelock delay has passed before executing
//     await mine(timelockDelay)

//     await governorContract
//       .connect(voter)
//       .execute([target], [0], [calldata], descriptionHash)

//     const afterBalance = await paymentToken.balanceOf(voter.address)

//     expect(afterBalance.eq(beforeBalance.add(proposalAmount)))
//   })
// })
