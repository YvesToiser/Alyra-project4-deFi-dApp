// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ByxManager is Ownable {

    IERC20 byx;

    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    constructor(address _byxAddress) {
        // inject BYX address in the deploy
        byx = IERC20(_byxAddress);
    }

    /**
    * @dev receive function will emit event in case of ether sent to the contract.
    */
    receive() external payable {
        emit LogDepot(msg.sender, msg.value);
    }

    /**
     * @dev fallback function will emit event in case of bad call of the contract.
     */
    fallback() external {
        emit LogBadCall(msg.sender);
    }

    /**
     * @notice withdraw function. Can only be used by the owner of the contract.
     *
     * @dev withdraw function. OnlyOwner.
     *
     * @param _amount the amount to withdraw.
     */
    function withdraw(uint _amount) external onlyOwner {
        msg.sender.call{value: _amount}("");
    }

    /**
     * @notice byxTransfer function. Used to transfer BYX tokens.
     *
     * @dev byxTransfer function. OnlyOwner.
     *
     * @param _recipient the address to send the tokens.
     *
     * @param _amount the amount to withdraw.
     */
    function byxTransfer(address _recipient, uint256 _amount) external onlyOwner{ // TODO change to onlyAuthorized
        byx.transfer(_recipient, _amount);
    }
}
