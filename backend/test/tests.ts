import { loadFixture, mine } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { toUtf8Bytes } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

const { parseEther } = ethers.utils

describe('Testing of the governor and Token Contract ', function () {
  const daoName = 'ETHSD'
  const votingDelay = 1
  const votingPeriod = 50400 // 1 week
  const tokenName = 'OurToken'
  const tokenSymbol = 'OUT'
  const timelockDelay = 300 // 1 hour
  const qourumFraction = 1

  async function deployFixture() {
    const [owner, ...voters] = await ethers.getSigners()

    //
    // Helpers
    //

    const getNextContractAddress = async (extraOffset: number = 0) => {
      return ethers.utils.getContractAddress({
        from: owner.address,
        nonce: (await owner.getTransactionCount()) + 1 + extraOffset
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

    const governorContractAddress = await getNextContractAddress()
    const TimeLockContract = await ethers.getContractFactory(
      'MyTimelockController'
    )
    const timeLockContract = await TimeLockContract.deploy(
      timelockDelay,
      [governorContractAddress],
      ['0x0000000000000000000000000000000000000000'],
      owner.address,
      parseEther('100'),
      { gasLimit: 30000000 }
    )

    //
    // Deploy Governor
    //

    const tokenContractAddress = await getNextContractAddress()
    const GovernorContract = await ethers.getContractFactory('GroupGovernor')
    const governorContract = await GovernorContract.deploy(
      daoName,
      tokenContractAddress,
      timeLockContract.address,
      paymentToken.address,
      votingDelay,
      votingPeriod,
      qourumFraction,
      { gasLimit: 30000000 }
    )

    //
    // Deploy Token
    //

    const TokenContract = await ethers.getContractFactory('TokenContract')
    const tokenContract = await TokenContract.deploy(
      governorContract.address,
      tokenName,
      tokenSymbol,
      { gasLimit: 30000000 }
    )
    // Let the owner mint his own NFT
    await tokenContract.safeMint(owner.address)
    await tokenContract.safeMint(voters[0].address)
    // Transfer the ownership of the token to the governor contract
    await tokenContract.transferOwnership(governorContract.address)

    // Debugging Logs:
    // console.log('Owner:', owner.address)
    // console.log('Voter:', voters[0].address)
    // console.log('Token Contract: ' + tokenContract.address)
    // console.log('Time Lock: ' + timeLockContract.address)
    // console.log('Governor Contract: ' + governorContract.address)

    return {
      paymentToken,
      timeLockContract,
      governorContract,
      tokenContract,
      owner,
      voters
    }
  }

  it('should have a TEST ERC20 token deployed', async () => {
    const { paymentToken } = await loadFixture(deployFixture)

    const supply = await paymentToken.totalSupply()
    assert(supply.gt('1'))
  })

  it('should provide the owner with an ERC721 token after they deploy', async () => {
    const { tokenContract, owner } = await loadFixture(deployFixture)

    // Owner should have a vote token :
    const votersTokenBalance = await tokenContract
      .connect(owner)
      .balanceOf(owner.address)
    expect(votersTokenBalance.toString()).equal('1')

    // Should automatically delegate vote to self token:
    const ownerDelegate = await tokenContract.delegates(owner.address)
    expect(ownerDelegate).equal(owner.address)
  })

  it('voter can join DAO', async () => {
    const { governorContract, owner, paymentToken, tokenContract, voters } =
      await loadFixture(deployFixture)
    const [voter] = voters

    // Voter must pay before joining
    await paymentToken
      .connect(voter)
      .approve(governorContract.address, parseEther('100'))
    // Vote joins
    await governorContract.connect(voter).join()

    // Voter should have a vote token
    const votersTokenBalance = await tokenContract.balanceOf(voter.address)
    expect(votersTokenBalance.toString()).equal('1')

    // Should automatically delegate vote to self token:
    const voterDelegate = await tokenContract.delegates(voter.address)
    expect(voterDelegate).equal(voter.address)

    describe('after voter joined', function () {
      it('token holders can delegate', async () => {
        describe('after delegating', function () {
          it('owner can create proposal', async () => {
            // Make proposal
            const description =
              'This is to pay one of the voters to fill a pothole'
            const tx = await governorContract
              .connect(owner)
              .propose([voter.address], [100], [toUtf8Bytes('')], description)
            const receipt = await tx.wait()
            const event = (receipt.events ?? [])[0]

            // Typescript type assertions:
            if (event == null) throw new Error('Expected event')
            if (event.eventSignature == null)
              throw new Error('Expected event signature')
            if (event.data == null) throw new Error('Expected event data')
            if (event.decode == null) throw new Error('Expected event decode')

            // Get proposalId
            const eventData = event.decode(event.data, event.topics)
            const proposalId = eventData.proposalId

            // mine a block for the proposal to pass the voting delay
            await mine(votingDelay)

            describe('after proposal', function () {
              it('Should allow the delegates to vote on proposal', async () => {
                const voteTx = await governorContract
                  .connect(voter)
                  .castVote(proposalId, 1)
                const ownerVoteTx = await governorContract
                  .connect(owner)
                  .castVote(proposalId, 1)
                await voteTx.wait()
                await ownerVoteTx.wait()

                describe('after vote', function () {
                  it('Should execute a proposal', async () => {
                    await mine(votingPeriod)

                    const descriptionHash = ethers.utils.id(description)
                    await governorContract
                      .connect(voter)
                      .queue(
                        [voter.address],
                        [100],
                        [toUtf8Bytes('')],
                        descriptionHash
                      )

                    // Wait until timelock delay has passed before executing
                    await mine(timelockDelay)

                    await governorContract
                      .connect(voter)
                      .execute(
                        [voter.address],
                        [100],
                        [toUtf8Bytes('')],
                        descriptionHash
                      )
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  it('voter must pay the minimum to join DAO', async () => {
    const {
      governorContract,
      voters: [voter]
    } = await loadFixture(deployFixture)

    // await usdcTokenContract.approve(governorContract.address, '100')
    await expect(governorContract.connect(voter).join()).to.revertedWith(
      'Must pay the minimum'
    )
  })

  // it.skip('Should allow the owner to create a proposal', async () => {
  //   const {
  //     owner,
  //     governorContract,
  //     paymentToken,
  //     tokenContract,
  //     voters: [voter]
  //   } = await loadFixture(deployFixture)

  //   const description = 'This is to pay one of the voters to fill a pothole'
  //   const tx = await governorContract
  //     .connect(owner)
  //     .propose([voter.address], [100], [toUtf8Bytes('')], description)
  //   const receipt = await tx.wait()
  //   const event = (receipt.events ?? [])[0]

  //   if (event == null) throw new Error('Expected event')
  //   if (event.eventSignature == null)
  //     throw new Error('Expected event signature')
  //   if (event.data == null) throw new Error('Expected event data')
  //   if (event.decode == null) throw new Error('Expected event decode')

  //   const eventData = event.decode(event.data, event.topics)
  //   const proposalId = eventData.proposalId

  //   // console.log(eventData)

  //   describe('after proposal', function () {
  //     it('voter can join DAO', async () => {
  //       // Mine a block
  //       await mine(1)

  //       await paymentToken
  //         .connect(voter)
  //         .approve(governorContract.address, parseEther('100'))
  //       await governorContract.connect(voter).join()

  //       const votersTokenBalance = await tokenContract.balanceOf(voter.address)
  //       expect(votersTokenBalance.toString()).equal('1')

  //       await mine(1)

  //       describe('after voter joined', function () {
  //         it('voter and owner can delegate', async () => {
  //           await tokenContract.connect(owner).delegate(owner.address)
  //           await tokenContract.connect(voter).delegate(voter.address)

  //           const ownerDelegate = await tokenContract.delegates(owner.address)
  //           const voterDelegate = await tokenContract.delegates(voter.address)

  //           console.log('delegates', ownerDelegate, voterDelegate)

  //           await mine(1)
  //           describe('after', function () {
  //             it('Should allow the voter to voter for a proposal', async () => {
  //               const ownerVote = await governorContract
  //                 .connect(owner)
  //                 .castVote(proposalId, 1)
  //               const voterVote = await governorContract
  //                 .connect(voter)
  //                 .castVote(proposalId, 1)
  //               await voterVote.wait()
  //               await ownerVote.wait()

  //               describe('after vote', function () {
  //                 it('Should execute a proposal', async () => {
  //                   // await time.increase(votingPeriod + 10)
  //                   await mine(votingPeriod + 10)

  //                   const descriptionHash = ethers.utils.id(description)
  //                   await governorContract
  //                     .connect(voter)
  //                     .queue(
  //                       [voter.address],
  //                       [100],
  //                       [toUtf8Bytes('')],
  //                       descriptionHash
  //                     )

  //                   // console.log(tx1)

  //                   // const tx2 = await governorContract
  //                   //   .connect(voter)
  //                   //   .execute([voter.address], [100], [toUtf8Bytes('')], descriptionHash)

  //                   // console.log(tx2)
  //                 })
  //               })
  //             })
  //           })
  //         })
  //       })
  //     })
  //   })
  // })
})
