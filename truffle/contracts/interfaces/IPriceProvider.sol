// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

interface IPriceProvider{

    /**
     * @dev give last ETHUSD price.
     */
    function getLatestETHUSDPrice() external view returns (int256);

    /**
     * @dev give last BYXUSD price
     */
    function getLatestBYXUSDPrice() external view returns (int256);

}

