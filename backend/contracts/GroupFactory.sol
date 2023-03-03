// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/governance/extensions/GovernorVotes.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import './GroupGovernor.sol';
import './MyTimelockController.sol';
import './TokenContract.sol';

contract GroupFactory {
  struct GroupRegistry {
    address owner;
    GroupGovernor governor;
    TimelockController timelock;
    IERC20 token;
  }

  uint public groupCount;
  GroupRegistry[] public groups;

  function createDAO(
    string memory _name,
    IVotes _token,
    TimelockController _timelock,
    IERC20 _paymentToken,
    uint256 _votingDelay,
    uint256 _votingPeriod,
    uint8 _quorumFraction
  ) external returns (address) {
    GroupGovernor governor = new GroupGovernor(
      _name,
      _token,
      _timelock,
      _paymentToken,
      _votingDelay,
      _votingPeriod,
      _quorumFraction
    );

    GroupRegistry memory group = GroupRegistry({
      owner: msg.sender,
      governor: governor,
      timelock: _timelock,
      token: IERC20(address(_token))
    });
    groups.push(group);
    ++groupCount;

    return address(governor);
  }
}
