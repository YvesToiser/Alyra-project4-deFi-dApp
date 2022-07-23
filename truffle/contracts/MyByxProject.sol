// MyDeFiProject.sol
pragma solidity 0.8.14;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyByxProject {
    IERC20 byx;

    constructor(address byxAddress) {
        // injecter l'address du token Byx à utiliser
        byx = IERC20(byxAddress);
    }

    // fonction qui permet d'effectuer un transfer de dai vers le recipient
    function foo(address recipient, uint256 amount) external {
        // quelques instructions
        byx.transfer(recipient, amount);
    }
}
