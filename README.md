# Tests AlyraProjet 4 Defi d'APP 

## Byx contract:

-**Getters**
-**Total supply & Mint**

## Getters
- should return token name correctly (8ms)
- should return token symbol correctly (6ms)
- should return max total supply correctly (6ms)

## Total supply & Mint

- should return total supply correctly  (0 value) (14ms)
- should return total supply correctly after mint (28ms, 73846 gas)
- should return total supply correctly after multiple mint (3000 value) (66ms, 187338 gas)
- should mint token on appropriate addresses (75ms, 187338 gas)
- should not mint if not by owner (26ms, 24835 gas)
- should not mint if max total supply has been reached (67ms, 103151 gas)


##  ByxStakingManager contract:

- **Staking**
-  **Unstaking**
-   **Rewards**
-    **Pool info**


## Staking
- should not stake with insufficient allowance (48ms, 81440 gas)
- should not stake with insufficient fund (23ms, 30369 gas)
- should not stake with null amount (38ms, 77123 gas)
- should stake correctly (82ms, 158109 gas)



## Unstaking
- should not unstake with insufficient allowance (40ms, 81399 gas)
- should not unstake with insufficient fund (20ms, 30304 gas)
- should not unstake with null amount (21ms, 30147 gas)
- should unstake correctly (90ms, 137014 gas)

## Rewards

- should reward correctly (276ms, 595070 gas)
- should increase reward with new block (364ms, 614966 gas)
- should increase reward with new block (286ms, 590270 gas)

## Pool info

- should return pool value correctly after initialization (34ms, 106607 gas)
- should return pool value correctly after staking (86ms, 264728 gas)
- should return APR correctly with initial stake (34ms, 106607 gas)
- should return APR correctly with bigger initial stake (36ms, 106619 gas)
- should return APR correctly with even bigger initial stake (37ms, 106619 gas)

## ETHStakingManager contract

- **Staking**
- **Unstaking**
-  **Rewards**

## Staking

- should not stake with insufficient amount (25ms, 95357 gas)
- should stake correctly (44ms, 166019 gas)
- should emit appropriate event when staking (29ms, 166019 gas)

## Unstaking

- should not unstake more than available (44ms, 190220 gas)
- should unstake correctly (45ms, 199470 gas)
- should emit appropriate event when unstaking (55ms, 199470 gas)

## Rewards
- should not claim rewards if none available (48ms, 192132 gas)
- should not have rewards before mandatory time (4052ms, 241080 gas)
- should update rewards, have rewards after mandatory time, claim rewards correctly if available and emit appropriate event (4140ms, 388769 gas)

## sByx contract

- **Getters**
- **Mint and authorization**
- **Burn  & Burn From** 

## Getters

- should return token name correctly (5ms)
- should return token symbol correctly (5ms)

## Mint and authorization

- should not mint if not authorized (17ms, 24906 gas)
- should not authorize by wrong address (17ms, 24495 gas)
- should mint if authorized (18ms, 46474 gas)

## Burn & Burn From

- should not burn if not owner (34ms, 95794 gas)
- should be able to burn if owner (37ms, 100780 gas)
- should not burn if balance is insufficient (17ms, 26718 gas)
- should not burn from if not authorized (37ms, 96343 gas)
- should be able to burn from if authorized (37ms, 101187 gas)
- 

**44 passing (27s)**
 










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

