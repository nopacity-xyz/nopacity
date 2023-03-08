// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import 'hardhat/console.sol';

import './OurVoteToken.sol';

contract OurGovernor is
  GovernorUpgradeable,
  GovernorCountingSimpleUpgradeable,
  GovernorVotesUpgradeable,
  GovernorVotesQuorumFractionUpgradeable,
  GovernorTimelockControlUpgradeable
{
  uint256 _votingDelay;
  uint256 _votingPeriod;
  address public paymentToken;
  string public daoDescription;

  uint minAmount = 100e18;

  function initialize(
    string memory _name,
    string memory _daoDescription,
    IVotesUpgradeable _token,
    TimelockControllerUpgradeable _timelock,
    IERC20 _paymentToken,
    uint256 __votingDelay,
    uint256 __votingPeriod,
    uint8 _quorumFraction
  ) public virtual initializer {
    __Governor_init(_name);
    __GovernorVotes_init(_token);
    __GovernorVotesQuorumFraction_init(_quorumFraction);
    __GovernorTimelockControl_init(_timelock);
    _votingDelay = __votingDelay;
    _votingPeriod = __votingPeriod;
    paymentToken = address(_paymentToken);
    daoDescription = _daoDescription;
  }

  function join() public {
    //uint allowance = IERC20(paymentToken).allowance(tx.origin, address(this));
    //require(allowance >= minAmount, 'minimum');

    // bool success = IERC20(paymentToken).transferFrom(
    //   tx.origin,
    //   timelock(),
    //   minAmount
    // );
    // require(success, 'Failed to transfer');
    console.log('You got here');
    console.log('origin is %s', tx.origin);
    console.log('token contract address is %s', address(token));
    OurVoteToken(address(token)).safeMint(tx.origin);
    console.log('and here');
  }

  function votingDelay() public view override returns (uint256) {
    return _votingDelay; // 1 block
  }

  function votingPeriod() public view override returns (uint256) {
    return _votingPeriod; // time in seconds
  }

  function proposalThreshold() public pure override returns (uint256) {
    return 0;
  }

  // The following functions are overrides required by Solidity.

  function quorum(
    uint256 blockNumber
  )
    public
    view
    override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
    returns (uint256)
  {
    return super.quorum(blockNumber);
  }

  function state(
    uint256 proposalId
  )
    public
    view
    override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (ProposalState)
  {
    return super.state(proposalId);
  }

  function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  )
    public
    override(GovernorUpgradeable, IGovernorUpgradeable)
    returns (uint256)
  {
    return super.propose(targets, values, calldatas, description);
  }

  function _execute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
    super._execute(proposalId, targets, values, calldatas, descriptionHash);
  }

  function _cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  )
    internal
    override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (uint256)
  {
    return super._cancel(targets, values, calldatas, descriptionHash);
  }

  function _executor()
    internal
    view
    override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (address)
  {
    return super._executor();
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
