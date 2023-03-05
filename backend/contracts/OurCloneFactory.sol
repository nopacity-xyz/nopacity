//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/proxy/Clones.sol';
import './OurGovernor.sol';
import 'hardhat/console.sol';
import './OurTimeLock.sol';
import './OurERC721.sol';
import 'hardhat/console.sol';

contract OurCloneFactory {
  address public governorImplementationContract;
  address public timeLockImplementationContract;
  address public erc721ImplementationContract;

  address[] public allGovernors;
  address[] public allTimeLocks;
  address[] public allERC721;

  struct daoInformation {
    address governor;
    address timelock;
    address erc721;
    address owner;
  }

  daoInformation[] DAOS;

  constructor(
    address _governorImplementationContract,
    address _timeLockImplementationContract,
    address _erc721ImplementationContract
  ) {
    governorImplementationContract = _governorImplementationContract;
    timeLockImplementationContract = _timeLockImplementationContract;
    erc721ImplementationContract = _erc721ImplementationContract;
  }

  event NewGovernorClone(address _governor);
  event NewTimeLockClone(address _timeLock);
  event NewERC721Clone(address _erc721);

  address[] proposers;
  address[] executors;

  //Creates new Governor Contract Clone
  function createNewGovernor(
    string memory _name,
    IVotesUpgradeable _token,
    TimelockControllerUpgradeable _timelock,
    IERC20 _paymentToken,
    uint256 __votingDelay,
    uint256 __votingPeriod,
    uint8 _quorumFraction
  ) public returns (address) {
    address instance = Clones.clone(governorImplementationContract);
    OurGovernor(payable(instance)).initialize(
      _name,
      _token,
      _timelock,
      _paymentToken,
      __votingDelay,
      __votingPeriod,
      _quorumFraction
    );
    emit NewGovernorClone(instance);
    allGovernors.push(instance);
    //Returns Governore Instance Address
    return instance;
  }

  // Creates New Time Lock Contract Clone
  function createNewTimeLock(
    uint256 minDelay,
    address admin,
    uint256 _minAmount
  ) public returns (address) {
    address instance = Clones.clone(timeLockImplementationContract);
    OurTimeLock(payable(instance)).initialize(
      minDelay,
      proposers,
      executors,
      admin,
      _minAmount
    );
    //Returns TimeLock Instance Address
    emit NewTimeLockClone(instance);
    allTimeLocks.push(instance);
    return instance;
  }

  //Creates new ERC721 Contract Clone
  function createNewERC721(
    address governor,
    string memory _tokenName,
    string memory _tokenSymbol
  ) public returns (address) {
    address instance = Clones.clone(erc721ImplementationContract);
    OurERC721(instance).initialize(governor, _tokenName, _tokenSymbol);
    emit NewERC721Clone(instance);
    allERC721.push(instance);
    return instance;
  }

  function getGovernorCloneFromArray(
    uint _index
  ) public view returns (address) {
    return allGovernors[_index];
  }

  function getTimeLockCloneFromArray(
    uint _index
  ) public view returns (address) {
    return allTimeLocks[_index];
  }

  function getTokenCloneFromArray(uint _index) public view returns (address) {
    return allERC721[_index];
  }

  function getArrayLength() public view returns (uint) {
    return allGovernors.length;
  }

  function createDAO(
    address determinedGovernorAddress,
    string memory _name,
    IVotesUpgradeable determinedTokenAddress,
    TimelockControllerUpgradeable determinedTimeAddress,
    IERC20 _paymentToken,
    uint256 __votingDelay,
    uint256 __votingPeriod,
    uint8 _quorumFraction,
    string memory _tokenName,
    string memory _tokenSymbol
  ) public returns (address) {
    executors.push(address(0));
    proposers.push(determinedGovernorAddress);

    address timeAddress = createNewTimeLock(300, tx.origin, 0);

    address govAddress = createNewGovernor(
      _name,
      determinedTokenAddress,
      determinedTimeAddress,
      _paymentToken,
      __votingDelay,
      __votingPeriod,
      _quorumFraction
    );

    address tokenAddress = createNewERC721(
      determinedGovernorAddress,
      _tokenName,
      _tokenSymbol
    );

    DAOS.push(daoInformation(govAddress, timeAddress, tokenAddress, tx.origin));

    return govAddress;
  }
}
