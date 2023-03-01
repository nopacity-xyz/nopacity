import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'

const { parseEther } = ethers.utils

describe('Testing of the governor and Token Contract ', function () {
  async function deployFixture() {
    const [owner, ...voters] = await ethers.getSigners()
    const daoName = 'ETHSD'
    const votingPeriod = 50400
    const tokenName = 'OurToken'
    const tokenSymbol = 'OUT'
    const minDelay = 172800
    const qourumFraction = 51

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

    const futureGovermentAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: await owner.getTransactionCount()
    })

    const TimeLockContract = await ethers.getContractFactory(
      'MyTimelockController'
    )
    const timeLockContract = await TimeLockContract.deploy(
      minDelay,
      [futureGovermentAddress],
      ['0x0000000000000000000000000000000000000000'],
      owner.address,
      parseEther('100'),
      { gasLimit: 30000000 }
    )

    // console.log('TIME LOCK: ' + timeLockContract.address)

    //
    // Deploy Governor
    //

    const futureTokenAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: (await owner.getTransactionCount()) + 1
    })

    const GovernorContract = await ethers.getContractFactory(
      'GovernorContractTimeLock'
    )
    const governorContract = await GovernorContract.deploy(
      daoName,
      futureTokenAddress,
      timeLockContract.address,
      paymentToken.address,
      votingPeriod,
      qourumFraction,
      { gasLimit: 30000000 }
    )

    // console.log('GOVERNOR CONTRACT: ' + governorContract.address)

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
    // Transfer the ownership of the token to the governor contract
    await tokenContract.transferOwnership(governorContract.address)

    // console.log('TOKEN CONTRACT: ' + tokenContract.address)

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

    const votersTokenBalance = await tokenContract.balanceOf(owner.address)
    expect(votersTokenBalance.toString()).equal('1')
  })

  it('voter can join DAO', async () => {
    const {
      paymentToken,
      tokenContract,
      governorContract,
      voters: [voter]
    } = await loadFixture(deployFixture)

    await paymentToken
      .connect(voter)
      .approve(governorContract.address, parseEther('100'))

    await governorContract.connect(voter).join()

    const votersTokenBalance = await tokenContract.balanceOf(voter.address)
    expect(votersTokenBalance.toString()).equal('1')
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
})

// describe("after proposing", () => {
//   async function afterProposingFixture() {
//     const deployValues = await deployFixture();
//     const { governorContract, tokenContract, owner } = deployValues;

//     const tx = await governor.propose(
//       [token.address],
//       [0],
//       [token.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
//       "Give the owner more tokens!"
//     );
//     const receipt = await tx.wait();
//     const event = receipt.events.find(x => x.event === 'ProposalCreated');
//     const { proposalId } = event.args;

//     // wait for the 1 block voting delay
//     await hre.network.provider.send("evm_mine");

//     return { ...deployValues, proposalId }
//   }

// it("should set the initial state of the proposal", async () => {
//   const { governorContract, proposalId } = await loadFixture(afterProposingFixture);

//   const state = await governorContract.state(proposalId);
//   assert.equal(state, 0);
// });

// describe("after voting", () => {
//   async function afterVotingFixture() {
//     const proposingValues = await afterProposingFixture();
//     const { governorContract, proposalId } = proposingValues;

//     const tx = await governorContract.castVote(proposalId, 1);
//     const receipt = await tx.wait();
//     const voteCastEvent = receipt.events.find(x => x.event === 'VoteCast');

//     // wait for the 1 block voting period
//     await hre.network.provider.send("evm_mine");

//     return { ...proposingValues, voteCastEvent }
//   }

// it("should have set the vote", async () => {
//   const { voteCastEvent, owner } = await loadFixture(afterVotingFixture);

//   assert.equal(voteCastEvent.args.voter, owner.address);
//   assert.equal(voteCastEvent.args.weight.toString(), parseEther("10000").toString());
// });

// it("should allow executing the proposal", async () => {
//   const { governor, token, owner } = await loadFixture(afterVotingFixture);

//   await governor.execute(
//     [token.address],
//     [0],
//     [token.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
//     keccak256(toUtf8Bytes("Give the owner more tokens!"))
//   );

// const balance = await token.balanceOf(owner.address);
// assert.equal(balance.toString(), parseEther("35000").toString());
// });
//     });
//   });
// });
