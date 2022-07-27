// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ETHUSDPriceProvider is Ownable {

    AggregatorV3Interface internal priceFeed;


    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);


    /** * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331 */
    constructor() {
        priceFeed = AggregatorV3Interface(
            0x9326BFA02ADD2366b30bacB125260Af641031331
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
     * @notice set a pair address
     *
     * @dev to set the adress of another pair on chainlink data feed
     *
     * @param _pair the address of the pair you want to set
     *
     *
     */
    function setAddr(address _pair) public {
        priceFeed = AggregatorV3Interface(_pair);
    }

    /**
     *
     * @dev to set the adress of another pair on chainlink data feed
     *
     * @return Returns the latest price
     *
     *@dev returns an int256 of latest price
     */
    function getLatestPrice() public view returns (int256) {
        (   /*uint80 roundID*/
            , int256 price,
            , /*uint startedAt*/
            , /*uint timeStamp*/
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}
