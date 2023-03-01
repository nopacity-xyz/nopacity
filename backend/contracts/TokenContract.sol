// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './TokenContractERC721.sol';

contract TokenContract is TokenContractERC721 {
  constructor(
    address _governor,
    string memory _tokenName,
    string memory _tokenSymbol
  ) TokenContractERC721(_governor, _tokenName, _tokenSymbol) {
    governor = _governor;
  }
}
