// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BYXStakingManager is Ownable {

    IERC20 BYX;
    IERC20 sBYX;

    uint BYXFund = 50000000;
    uint BYXPool = 1000;
    uint BYXRewardPerBlock = 5;

    uint sBYXFund = 10000000;
    uint totalsBYXDistributed = 1000;

    uint lastBlockUpdate;
    uint lastBlockReward;

    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    /*************************************************************************************************/
    /*                                        SPECIAL FUNCTIONS                                      */
    /*************************************************************************************************/

    constructor(address _byxAddress, address _sbyxAddress) {
        // inject BYX address in the deploy
        BYX = IERC20(_byxAddress);
        sBYX = IERC20(_sbyxAddress);
        lastBlockUpdate = block.number;
        lastBlockReward = block.number + (BYXFund / BYXRewardPerBlock);
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

    /*************************************************************************************************/
    /*                                          VIEW FUNCTIONS                                       */
    /*************************************************************************************************/



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
     * @notice deposit stake function.
     *
     * @dev deposit stake function. Call internal function for gas optimisation.
     *
     * @param _amount the amount to deposit in staking.
     */
    function depositStake(uint _amount) external {
        _depositStake(_amount);
    }

    /**
     * @notice withdraw stake function.
     *
     * @dev withdraw stake function. Call internal function for gas optimisation.
     *
     * @param _amount the amount to withdraw from staking.
     */
    function withdrawStake(uint _amount) external {
        _withdrawStake(_amount);
    }


    /*************************************************************************************************/
    /*                                        INTERNAL FUNCTIONS                                     */
    /*************************************************************************************************/

    /**
     * @notice deposit stake function.
     *
     * @dev deposit stake function.
     *
     * @param _amount the amount to deposit in staking.
     */
    function _depositStake(uint _amount) internal {
        require(BYX.balanceOf(msg.sender) >= _amount, "Not enough BYX in wallet");
        require(_amount > 0, "Amount must be positive");
        BYXPool += _amount;
        BYX.transferFrom(msg.sender, address(this), _amount);  // TODO check if we need allowance
        uint _sBYXamount = _calculateSBYXAmountFromBYX(_amount);
        sBYXFund -= _sBYXamount;
        totalsBYXDistributed += _sBYXamount;
        sBYX.transferFrom(address(this), msg.sender, _sBYXamount);
    }

    /**
     * @notice withdraw stake function.
     *
     * @dev withdraw stake function.
     *
     * @param _sBYXAmount the amount to withdraw from staking.
     */
    function _withdrawStake(uint _sBYXAmount) internal {
        require(sBYX.balanceOf(msg.sender) >= _sBYXAmount, "Not enough sBYX in wallet");
        totalsBYXDistributed -= _sBYXAmount;
        sBYX.transferFrom(msg.sender, address(this), _sBYXAmount);
        uint _amount = calculateBYXAmountFromsBYX(_sBYXAmount);
        BYXPool -= _amount;
        BYX.transferFrom(address(this), msg.sender, _amount);
    }

    /**
     * @notice calculate sBYX amount from BYX amount.
     *
     * @dev calculate sBYX amount from BYX amount.
     *
     * @param _amount the amount of BYX to convert.
     */
    function _calculateSBYXAmountFromBYX(uint _amount) internal returns (uint _sBYXAmount) {
        _updatePool();
        return _amount * totalsBYXDistributed / BYXPool;
    }

    /**
     * @notice calculate BYX amount from sBYX amount.
     *
     * @dev calculate BYX amount from sBYX amount.
     *
     * @param _amount the amount of sBYX to convert.
     */
    function calculateBYXAmountFromsBYX(uint _sBYXAmount) internal returns (uint _amount) {
        _updatePool();
        return _sBYXAmount * BYXPool / totalsBYXDistributed;
    }

    /**
     * @notice update pool with new rewards.
     *
     * @dev update pool with new rewards.
     */
    function _updatePool() internal {
        require(block.number <= lastBlockReward, "Rewards have already ended");
        if (block.number > lastBlockUpdate) {
            uint nbBlock = block.number - lastBlockUpdate;
            BYXPool += nbBlock * BYXRewardPerBlock;
            BYXFund -= nbBlock * BYXRewardPerBlock;
            lastBlockUpdate = block.number;
       }
    }
}
