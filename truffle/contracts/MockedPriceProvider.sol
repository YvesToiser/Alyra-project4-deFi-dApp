// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPriceProvider.sol";

contract PriceProvider is Ownable, IPriceProvider {

    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal byxPriceFeed;

    function getLatestETHUSDPrice() public view returns (int256) {
        return 1843 * 10 ** 18;
    }

    function getLatestBYXUSDPrice() public view returns (int256) {
        return 6 * 10 ** 18;
    }
}
