// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./interfaces/IPriceProvider.sol";

/**
 * This contract is a mocked contract of PriceProvider.sol
 * As PriceProvider.sol can work only on Kovan network, we need to mock his functions for local network testing purpose.
 */
contract MockedPriceProvider is IPriceProvider{

    /**
     * @dev Return mocked ETHUSD price
     *
     * @return Returns the mocked ETHUSD price
     */
    function getLatestETHUSDPrice() public pure returns (int256) {
        return 1843634 * 10 ** 15;
    }

    /**
     * @dev Return mocked BYXUSD price
     *
     * @return Returns the mocked BYXUSD price
     */
    function getLatestBYXUSDPrice() public pure returns (int256) {
        return 9148 * 10 ** 15;
    }
}
