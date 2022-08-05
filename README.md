# Tests AlyraProjet 4 Defi d'APP 

## Byx contract:

-**Getters**
-**Total supply & Mint**

## Getters
- should return token name correctly (6ms)
- should return token symbol correctly (8ms)
- should return max total supply correctly (7ms)

## Total supply & Mint

- should return total supply correctly  (0 value) (5ms)
- should return total supply correctly after mint (28ms, 73846 gas)
- should return total supply correctly after multiple mint (3000 value) (66ms, 187326 gas)
- should mint token on appropriate addresses (75ms, 187326 gas)
- should not mint if not by owner (26ms, 24835 gas)
- should not mint if max total supply has been reached (67ms, 103151 gas)



##  ByxStakingManager contract:


- **Staking**
-  **Unstaking**
-   **Rewards**
-    **Pool info**



## Staking
- should not stake with insufficient allowance (42ms, 81440 gas)
- should not stake with insufficient fund (32ms, 30369 gas)
- should not stake with null amount (47ms, 77123 gas)
- should stake correctly (84ms, 158121 gas)




## Unstaking
- should not unstake with insufficient allowance (50ms, 81399 gas)
- should not unstake with insufficient fund (21ms, 30304 gas)
- should not unstake with null amount (20ms, 30147 gas)
- should unstake correctly (81ms, 137014 gas)


## Rewards

- should reward correctly (268ms, 595070 gas)
- should increase reward with new block (259ms, 590270 gas)

## Pool info

- should return pool value correctly after initialization (29ms, 106607 gas)
- should return pool value correctly after staking (93ms, 264728 gas)
- should return APR correctly with initial stake (22ms, 106607 gas)
- should return APR correctly with bigger initial stake (26ms, 106619 gas)
- should return APR correctly with even bigger initial stake (25ms, 106619 gas)


## sByx contract

- **Getters**
- **Mint and authorization**
- **Burn  & Burn From** 

## Getters

- should return token name correctly (9ms)
- should return token symbol correctly (4ms)

## Mint and authorization

- should not mint if not authorized (15ms, 24906 gas)
- should not authorize by wrong address (20ms, 24495 gas)
- should mint if authorized (14ms, 46474 gas)

## Burn & Burn From

- should not burn if not owner (39ms, 95782 gas)
- should be able to burn if owner (36ms, 100780 gas)
- should not burn if balance is insufficient (18ms, 26718 gas)
- should not burn from if not authorized (37ms, 96343 gas)
- should be able to burn from if authorized (33ms, 101187 gas)


**34 passing (27s)**
 

# React Truffle Box

This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

Start the react dev server.

```sh
$ cd client
$ npm start
  Starting the development server...
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Create React App](https://create-react-app.dev). Either one would be a great place to start!
