// SPDX-License-Identifier: MIT
/// Byx.sol

pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Byx is ERC20 {
    constructor() ERC20("Byx", "BYX") {}

    /**
     * @notice creation  of a ERC20 Byx token
     *
     * @dev minting of Byx token
     *
     * @param _recipient the recipient of token _amount the _amount
     *
     * @param _amount the amount
     *
     *
     */
    function faucet(address _recipient, uint256 _amount) external {
        _mint(_recipient, _amount);
    }
}
