// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol';

contract TokenContract is ERC20, ERC20Permit, ERC20Votes {
  address governor;

  constructor(
    address _governor,
    uint256 _premintAmount,
    string memory _tokenName,
    string memory _tokenSymbol
  ) ERC20(_tokenName, _tokenSymbol) ERC20Permit(_tokenName) {
    governor = _governor;
    _mint(msg.sender, _premintAmount * 10 ** decimals());
  }

  function mint(address to, uint256 amount) external {
    require(governor == msg.sender);
    _mint(to, amount);
  }

  // The functions below are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._mint(to, amount);
  }

  function _burn(
    address account,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._burn(account, amount);
  }
}
