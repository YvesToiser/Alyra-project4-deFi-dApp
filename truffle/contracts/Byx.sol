// SPDX-License-Identifier: MIT
// Byx.sol

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Byx is ERC20 {
    constructor() ERC20("Byx Stablecoin", "BYX") {}

    // fonction faucet pour créer des Dai tokens
    function faucet(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
