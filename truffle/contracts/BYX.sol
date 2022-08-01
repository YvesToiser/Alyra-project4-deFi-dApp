// SPDX-License-Identifier: MIT
/// BYX.sol

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BYX is ERC20, Ownable {

    // Custom variables
    uint public maxTotalSupply = 100000000;

    // ERC20 variables
    uint256 private _totalSupply;

    // Custom Events
    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    /*************************************************************************************************/
    /*                                        SPECIAL FUNCTIONS                                      */
    /*************************************************************************************************/

    constructor() ERC20("Byx", "BYX") {}

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

    /*************************************************************************************************/
    /*                                        EXTERNAL FUNCTIONS                                     */
    /*************************************************************************************************/

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
     * @notice creation  of a ERC20 Byx token
     *
     * @dev minting of Byx token
     *
     * @param _recipient the recipient of token
     *
     * @param _amount the amount
     */
    function mint(address _recipient, uint256 _amount) external onlyOwner {
        require((maxTotalSupply - totalSupply()) >= _amount, "Not enough coins remaining");
        _mint(_recipient, _amount);
    }

}
