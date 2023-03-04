// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/governance/Governor.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorVotes.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol';
import '@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import './TokenContract.sol';

contract GroupGovernor is
  Governor,
  GovernorCountingSimple,
  GovernorVotes,
  GovernorVotesQuorumFraction,
  GovernorTimelockControl
{
  uint256 votingperiod;
  address public paymentToken;

  uint minAmount = 100e18;

  constructor(
    string memory _name,
    IVotes _token,
    TimelockController _timelock,
    IERC20 _paymentToken,
    uint256 _votingPeriod,
    uint8 _quorumFraction
  )
    Governor(_name)
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(_quorumFraction)
    GovernorTimelockControl(_timelock)
  {
    votingperiod = _votingPeriod;
    paymentToken = address(_paymentToken);
  }

  function join() external {
    uint allowance = IERC20(paymentToken).allowance(msg.sender, address(this));
    require(allowance >= minAmount, 'Must pay the minimum');

    bool success = IERC20(paymentToken).transferFrom(
      msg.sender,
      timelock(),
      minAmount
    );
    require(success, 'Failed to transfer ERC20');

    TokenContract(address(token)).safeMint(msg.sender);
  }

  function votingDelay() public pure override returns (uint256) {
    return 1; // 1 block
  }

  function votingPeriod() public view override returns (uint256) {
    return votingperiod; // time in seconds
  }

  function proposalThreshold() public pure override returns (uint256) {
    return 1;
  }

  // The following functions are overrides required by Solidity.

  function quorum(
    uint256 blockNumber
  )
    public
    view
    override(IGovernor, GovernorVotesQuorumFraction)
    returns (uint256)
  {
    return super.quorum(blockNumber);
  }

  function state(
    uint256 proposalId
  )
    public
    view
    override(Governor, GovernorTimelockControl)
    returns (ProposalState)
  {
    return super.state(proposalId);
  }

  function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  ) public override(Governor, IGovernor) returns (uint256) {
    return super.propose(targets, values, calldatas, description);
  }

  function _execute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(Governor, GovernorTimelockControl) {
    super._execute(proposalId, targets, values, calldatas, descriptionHash);
  }

  function _cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
    return super._cancel(targets, values, calldatas, descriptionHash);
  }

  function _executor()
    internal
    view
    override(Governor, GovernorTimelockControl)
    returns (address)
  {
    return super._executor();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(Governor, GovernorTimelockControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
