// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './GovernorContractTimeLock.sol';
import './MyTimelockController.sol';
import './TokenContract.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Factory {
  GovernorContractTimeLock _governor;
  MyTimelockController _timeLock;
  TokenContract _token;

  GovernorContractTimeLock[] public list_of_governors;
  MyTimelockController[] public list_of_timelocks;
  TokenContract[] public list_of_tokens;

  IERC20 private paymentToken;

  struct deployedContract {
    address governorContract;
    address timelockContract;
    address tokenContract;
    address owner;
  }

  deployedContract[] public contracts;

  function createDAO(
    uint256 _minDelay,
    uint256 _minAmount,
    string memory _daoName,
    uint256 _votingPeriod,
    uint8 _quorumFraction,
    string memory _tokenName,
    string memory _tokenSymbol
  ) external {
    paymentToken = IERC20(0xCC42724C6683B7E57334c4E856f4c9965ED682bD);

    address[] memory futureGovernorAddress = new address[](1);
    futureGovernorAddress[0] = getAddressForFutureContract(msg.sender);

    address[] memory executor = new address[](1);
    executor[0] = address(0);

    _timeLock = new MyTimelockController(
      _minDelay,
      futureGovernorAddress,
      executor,
      msg.sender,
      _minAmount
    );
    list_of_timelocks.push(_timeLock);

    address futureTokenAddress = getAddressForFutureContract(msg.sender);

    address _timeLockAddress = address(_timeLock);

    _governor = new GovernorContractTimeLock(
      _daoName,
      IVotes(futureTokenAddress),
      _timeLock,
      paymentToken,
      _votingPeriod,
      _quorumFraction
    );
    list_of_governors.push(_governor);

    address _governorAddress = address(_governor);

    _token = new TokenContract(_governorAddress, _tokenName, _tokenSymbol);
    list_of_tokens.push(_token);

    address _tokenAddress = address(_token);

    deployedContract memory currentContract = deployedContract({
      governorContract: _governorAddress,
      timelockContract: _timeLockAddress,
      tokenContract: _tokenAddress,
      owner: msg.sender
    });

    contracts.push(currentContract);
  }

  function getAddressForFutureContract(
    address deployer
  ) private view returns (address) {
    uint256 nonce = getNonce(deployer);
    bytes32 hash = keccak256(abi.encodePacked(deployer, nonce));
    address futureContractAddress = address(uint160(uint256(hash)));
    return futureContractAddress;
  }

  function getNonce(address deployer) private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(deployer, block.number)));
  }
}
