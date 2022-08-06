// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPriceProvider.sol";

contract MockedPriceProvider is Ownable, IPriceProvider {

    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal byxPriceFeed;

    function getLatestETHUSDPrice() public pure returns (int256) {
        return 1843634 * 10 ** 15;
    }

    function getLatestBYXUSDPrice() public pure returns (int256) {
        return 9148 * 10 ** 15;
    }
}
