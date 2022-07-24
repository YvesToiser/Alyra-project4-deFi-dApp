// SPDX-License-Identifier: MIT
// Byx.sol

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Byx is ERC20 {
    constructor() ERC20("Byx Stablecoin", "BYX") {}

    // fonction faucet pour créer des Byx tokens
    function faucet(address _recipient, uint256 _amount) external {
        _mint(_recipient, _amount);
    }
}
