// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPriceProvider.sol";

contract PriceProvider is Ownable, IPriceProvider {

    /// Chainlink Price feed
    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal byxPriceFeed;

    /// Events emitted in case of bad call or unexpected depot on the contract
    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    /*************************************************************************************************/
    /*                                        SPECIAL FUNCTIONS                                      */
    /*************************************************************************************************/

    /**
     * @dev
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     *
     * Aggregator: UNI/USD
     * Address: 0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39
     *
     * @notice : As we do not have data feed for BYX price, we use UNI price instead for exercise purpose.
     */
    constructor() {
        ethPriceFeed = AggregatorV3Interface(
            0x9326BFA02ADD2366b30bacB125260Af641031331
        );
        byxPriceFeed = AggregatorV3Interface(
            0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39
        );
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
     * @dev Return ETHUSD price
     *
     * @return Returns the latest price
     */
    function getLatestETHUSDPrice() public view returns (int256) {
        (   /*uint80 roundID*/
            , int256 price,
            , /*uint startedAt*/
            , /*uint timeStamp*/
            /*uint80 answeredInRound*/
            ) = ethPriceFeed.latestRoundData();
        return price;
    }

    /**
    * @dev Return BYXUSD price
    *
    * @return Returns the latest price
    */
    function getLatestBYXUSDPrice() public view returns (int256) {
        (   /*uint80 roundID*/
            , int256 price,
            , /*uint startedAt*/
            , /*uint timeStamp*/
            /*uint80 answeredInRound*/
        ) = byxPriceFeed.latestRoundData();
        return price;
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
     * @notice set ETHUSD pair address
     *
     * @dev to set the adress of ETHUSD pair on chainlink data feed
     *
     * @param _pair the address of the ETHUSD pair
     */
    function setEthAddr(address _pair) external onlyOwner {
        ethPriceFeed = AggregatorV3Interface(_pair);
    }

    /**
     * @notice set BYXUSD pair address
     *
     * @dev to set the adress of BYXUSD pair on chainlink data feed
     *
     * @param _pair the address of the BYXUSD pair
     */
    function setByxAddr(address _pair) external onlyOwner {
        byxPriceFeed = AggregatorV3Interface(_pair);
    }

}