import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { assert } from 'chai'
import { ethers } from 'hardhat'
const { parseEther } = ethers.utils

describe('Testing of the governor and Token Contract ', function () {
  async function deployFixture() {
    const [owner, voter1, voter2, voter3, voter4, voter5, voter6] =
      await ethers.getSigners()
    const daoName = 'ETHSD'
    const votingPeriod = 50400
    const quorumPercentage = 4
    const premintAmount = 10000
    const tokenName = 'OurToken'
    const tokenSymbol = 'OUT'
    const minDelay = 504

    const transactionCountGovernor = await owner.getTransactionCount()

    const futureGovermentAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: transactionCountGovernor
    })

    const TimeLockAddress = await ethers.getContractFactory(
      'MyTimelockController'
    )
    const timeLockAddress = await TimeLockAddress.deploy(
      minDelay,
      [futureGovermentAddress],
      ['0x0000000000000000000000000000000000000000'],
      owner.address,
      { gasLimit: 30000000 }
    )

    console.log('TIME LOCK: ' + timeLockAddress.address)

    const transactionCount = await owner.getTransactionCount()

    const futureTokenAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: transactionCount + 1
    })

    const GovernorContract = await ethers.getContractFactory(
      'GovernorContractTimeLock'
    )
    const governorContract = await GovernorContract.deploy(
      daoName,
      futureTokenAddress,
      timeLockAddress.address,
      votingPeriod,
      quorumPercentage,
      { gasLimit: 30000000 }
    )

    console.log('GOVERNOR CONTRACT: ' + governorContract.address)

    const TokenContract = await ethers.getContractFactory('TokenContract')
    const tokenContract = await TokenContract.deploy(
      governorContract.address,
      premintAmount,
      tokenName,
      tokenSymbol,
      { gasLimit: 30000000 }
    )

    console.log('TOKEN CONTRACT: ' + tokenContract.address)

    await tokenContract.delegate(owner.address)

    return {
      governorContract,
      tokenContract,
      owner,
      voter1,
      voter2,
      voter3,
      voter4,
      voter5,
      voter6
    }
  }

  it('should provide the owner with a starting balance', async () => {
    const {
      // governorContract,
      tokenContract,
      owner
      //   voter1,
      //   voter2,
      //   voter3,
      //   voter4,
      //   voter5,
      //   voter6
    } = await loadFixture(deployFixture)

    const balance = await tokenContract.balanceOf(owner.address)
    assert.equal(balance.toString(), parseEther('10000'))
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
