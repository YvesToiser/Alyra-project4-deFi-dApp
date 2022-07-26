// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BYXStakingManager is Ownable {

    IERC20 BYX;

    uint contractBYXBalance = 50000000;
    mapping (address => uint) BYXStaked;
    uint totalBYXStaked;

    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    constructor(address _byxAddress) {
        // inject BYX address in the deploy
        BYX = IERC20(_byxAddress);
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
     * @notice deposit stake function.
     *
     * @dev deposit stake function.
     *
     * @param _amount the amount to deposit in staking.
     */
    function depositStake(uint _amount) external {
        require(BYX.balanceOf(msg.sender) >= _amount, "Not enough BYX staked");
        totalBYXStaked += _amount;
        BYXStaked[msg.sender] += _amount;
        BYX.transferFrom(msg.sender, address(this), _amount);  // TODO check if we need allowance
    }

    /**
     * @notice withdraw stake function.
     *
     * @dev withdraw stake function.
     *
     * @param _amount the amount to withdraw from staking.
     */
    function withdrawStake(uint _amount) external {
        require(BYXStaked[msg.sender] >= _amount, "Not enough BYX staked");
        totalBYXStaked += _amount;
        BYXStaked[msg.sender] += _amount;
        BYX.transferFrom(address(this), msg.sender, _amount);
    }
}
