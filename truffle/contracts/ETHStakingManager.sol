// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPriceProvider.sol";

contract ETHStakingManager is Ownable {

    /// External contract
    IERC20 BYX;
    IPriceProvider PriceProvider;

    /// BYX token fund for staking rewards
    uint lastBlockUpdate;
    uint BYXFund = 20000000 * 10 ** 18; // 20 000 000 tokens
    uint public APR = 800; // in bps -> 800 bps = 8% annual rate
    uint ETHPrice;
    uint BYXPrice;

    /// User Info
    struct User {
        uint pendingRewards;   // in BYX
        uint ethAmountStaked;  // in ETH
    }
    /// User retrievers
    mapping(address => User) users;
    address[] userList;

    /// Events for activity tracking
    event Stake(address user, uint amount);
    event WithdrawStake(address user, uint amount);
    event RewardsClaimed(address user, uint amount);
    event PoolUpdate();

    /// Events emitted in case of bad call or unexpected depot on the contract
    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    /*************************************************************************************************/
    /*                                        SPECIAL FUNCTIONS                                      */
    /*************************************************************************************************/

    /**
     * @notice constructor
     *
     * @dev constructor
     *
     * @param _byxAddress. The address of BYX contract.
     *
     * @param _PPAddress. The address of Price Provider contract.
     */
    constructor(address _byxAddress, address _PPAddress) {
        // inject BYX address and price provider address in the deploy.
        BYX = IERC20(_byxAddress);
        PriceProvider = IPriceProvider(_PPAddress);
        lastBlockUpdate = block.number;
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

    /**
     * @notice Get User Info.
     *
     * @dev Get User Info.
     *     struct User {
     *      uint pendingRewards;   // in BYX
     *      uint ethAmountStaked;  // in ETH
     *     }
     *
     * @param _user the address of the user.
     *
     * @return User memory. A User (struct described above).
     */
    function getUserInfo(address _user) external view returns(User memory){
        return users[_user];
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
     * @notice staking function. Deposit ETH in the contract for staking.
     *
     * @dev staking function. Amount staked is in msg.value.
     */
    function depositStake() external payable {
        // We set a mimimum amount to stake to protect potential DOS vulnerability in loop in _updateRewards() function.
        require(msg.value >= 1 * 10 ** 17, 'Minimum stake is 0.1 ETH.');
        _updateRewards();
        if(users[msg.sender].ethAmountStaked == 0) {
            userList.push(msg.sender);
        }
        users[msg.sender].ethAmountStaked += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    /**
     * @notice unstake function.
     *
     * @dev unstake function.
     *
     * @param _amount the amount to withdraw.
     */
    function withdrawStake(uint _amount) external {
        _withdrawStake(_amount);
    }

    /**
     * @notice claim function.
     *
     * @dev claim function.
     */
    function claimRewards() external {
        _claimRewards();
    }

    /*************************************************************************************************/
    /*                                        INTERNAL FUNCTIONS                                     */
    /*************************************************************************************************/

    /**
     * @dev unstake function.
     *
     * @param _amount the amount to withdraw.
     */
    function _withdrawStake(uint _amount) internal {
        _updateRewards();
        require(_amount <= users[msg.sender].ethAmountStaked, 'Not enough ETH staked.');
        users[msg.sender].ethAmountStaked -= _amount;
        msg.sender.call{value: _amount}("");
        emit WithdrawStake(msg.sender, _amount);
    }

    /**
     * @dev claim function.
     */
    function _claimRewards() internal {
        _updateRewards();
        require(users[msg.sender].pendingRewards > 0, 'You have no rewards to claim.');
        uint _amount = users[msg.sender].pendingRewards;
        users[msg.sender].pendingRewards = 0;
        BYX.transfer(msg.sender, _amount);
        emit RewardsClaimed(msg.sender, _amount);
    }

    /**
     * @dev update function.
     */
    function _updateRewards() internal {
        // We decide to update rewards only if it has not been updated for 1 day.
        if (block.number > lastBlockUpdate + 6400) {
            _updatePrices();
            uint BYXYearlyRewardPerETH = APR * ETHPrice / BYXPrice;
            uint nbOfBlockToUpdate = block.number - lastBlockUpdate;
            // Risk for DDOS is minimum as potential attacker needs to stake ETH to add an entry in the array
            // Therefore, we add a minimum amount to stake to protect this potential vulnerability
            for (uint i = 0; i < userList.length; i++) {
                // New Reward = user ETH staked amount * yearly reward in BYX (in bps) * period ratio (time passed / a year)
                uint _newRewards = users[userList[i]].ethAmountStaked * BYXYearlyRewardPerETH * nbOfBlockToUpdate / (10000 * 6400 * 365);
                users[userList[i]].pendingRewards += _newRewards;
            }
            lastBlockUpdate = block.number;
            emit PoolUpdate();
        }
    }

    /**
     * @dev update ETH & BYX Prices.
     * Prices are get from PriceProvider which get them from Chainlink data feed.
     *
     * !!! Use appropriate Price Provider depending on deployed network !!!
     */
    function _updatePrices() internal {
        ETHPrice = uint(PriceProvider.getLatestETHUSDPrice());
        BYXPrice = uint(PriceProvider.getLatestBYXUSDPrice());
    }

}