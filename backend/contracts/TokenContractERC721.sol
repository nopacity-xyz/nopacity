// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract TokenContractERC721 is ERC721, Ownable, EIP712, ERC721Votes {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  address governor;

  constructor(
    address _governor,
    string memory _tokenName,
    string memory _tokenSymbol
  ) ERC721(_tokenName, _tokenSymbol) EIP712(_tokenName, '1') {
    governor = _governor;
  }

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Votes) {
    super._afterTokenTransfer(from, to, tokenId, batchSize);
  }
}
