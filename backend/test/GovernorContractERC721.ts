import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { ethers } from 'hardhat'

const { parseEther } = ethers.utils

describe('Testing of the governor and Token Contract ', function () {
  async function deployFixture() {
    const [owner, voter1, voter2, voter3, voter4, voter5, voter6] =
      await ethers.getSigners()
    const daoName = 'ETHSD'
    const votingPeriod = 50400
    const tokenName = 'OurToken'
    const tokenSymbol = 'OUT'
    const minDelay = 172800
    const qourumFraction = 51

    const transactionCountGovernor = await owner.getTransactionCount()

    const futureGovermentAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: transactionCountGovernor
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

    console.log('TIME LOCK: ' + timeLockContract.address)

    const value = parseEther('500')

    const tx = await owner.sendTransaction({
      to: timeLockContract.address,
      value
    })

    console.log(tx)

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
      timeLockContract.address,
      votingPeriod,
      qourumFraction,
      { gasLimit: 30000000 }
    )

    console.log('GOVERNOR CONTRACT: ' + governorContract.address)

    const TokenContract = await ethers.getContractFactory('TokenContract')
    const tokenContract = await TokenContract.deploy(
      governorContract.address,
      tokenName,
      tokenSymbol,
      { gasLimit: 30000000 }
    )

    console.log('TOKEN CONTRACT: ' + tokenContract.address)

    return {
      timeLockContract,
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

  it('should provide the owner with an ERC721 token after they paid', async () => {
    const { tokenContract, owner } = await loadFixture(deployFixture)

    const balance = await tokenContract.balanceOf(owner.address)
    console.log('THE Balance is')
    console.log(balance)
  })

  it('should provide the voter with an ERC721 token', async () => {
    const { tokenContract, voter1 } = await loadFixture(deployFixture)

    await tokenContract.safeMint(voter1.address)
    const balance = await tokenContract.balanceOf(voter1.address)
    console.log('The Balance is')
    console.log(balance)
  })

  it('Should allow the voter to send money to the dao', async () => {
    const { timeLockContract, owner } = await loadFixture(deployFixture)
    const value = parseEther('500')
    const tx = await owner.sendTransaction({
      to: timeLockContract.address,
      value
    })
    console.log(tx)
    const balance = await ethers.provider.getBalance(timeLockContract.address)
    console.log(balance)
  })

  it('Should allow the voter to send money to the dao', async () => {
    const { timeLockContract, owner } = await loadFixture(deployFixture)
    const value = parseEther('500')
    const tx = await owner.sendTransaction({
      to: timeLockContract.address,
      value
    })
    console.log(tx)
    const balance = await ethers.provider.getBalance(timeLockContract.address)
    console.log(balance)
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
