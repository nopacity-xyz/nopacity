// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (governance/TimelockController.sol)

pragma solidity ^0.8.0;

import './TimelockController.sol';

interface TokenContract{
    

}

contract MyTimelockController is TimelockController {
  uint256 minAmount;

  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors,
    address admin,
    uint256 _minAmount
  ) TimelockController(minDelay, proposers, executors, admin) {
    minAmount = _minAmount;
  }

  function joinDao(address _user) external payable {
    require(msg.value >= minAmount);


  }
}
