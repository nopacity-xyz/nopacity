// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (governance/TimelockController.sol)

pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol';

contract OurTimeLock is TimelockControllerUpgradeable {
  uint256 minAmount;

  function initialize(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors,
    address admin,
    uint256 _minAmount
  ) public virtual initializer {
    __TimelockController_init(minDelay, proposers, executors, admin);
    minAmount = _minAmount;
  }
}
