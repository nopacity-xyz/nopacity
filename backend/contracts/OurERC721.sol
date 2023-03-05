// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/draft-ERC721VotesUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract OurERC721 is
  ERC721Upgradeable,
  OwnableUpgradeable,
  EIP712Upgradeable,
  ERC721VotesUpgradeable
{
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  address governor;

  function initialize(
    address _governor,
    string memory _tokenName,
    string memory _tokenSymbol
  ) public virtual initializer {
    __ERC721_init(_tokenName, _tokenSymbol);
    __EIP712_init(_tokenName, '1');
    governor = _governor;
  }

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _delegate(to, to);
  }

  // The following functions are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal virtual override(ERC721Upgradeable, ERC721VotesUpgradeable) {
    super._afterTokenTransfer(from, to, tokenId, batchSize);
  }
}
