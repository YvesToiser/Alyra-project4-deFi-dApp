// SPDX-License-Identifier: MIT
// MyByxProject.sol

pragma solidity 0.8.14;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyByxProject {
    IERC20 byx;

    constructor(address byxAddress) {
        // injecter l'address du token Byx à utiliser
        byx = IERC20(byxAddress);
    }

    // fonction qui permet d'effectuer un transfer de Byx vers le recipient
    function foo(address recipient, uint256 amount) external {
        // quelques instructions
        byx.transfer(recipient, amount);
    }
}
