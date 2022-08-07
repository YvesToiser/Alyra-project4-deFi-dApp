# Alyra - Blockchain developer - Project 4 - deFi - 

## Authors
- Benjamin Reynes
- Xavier Combs
- Yves Toiser

## Description
This is the final project from the Alyra training for blockchain developer.   

- This is a staking platform where you can either stake a custom ERC20 or native ETH.
- Staking can be registered on chain or via the emission of another custom ERC20.
- Staking rewards calculation should use Chainlink data feed.
- When staking custom ERC20 token 'BYX' you will retrieve a ERC20 token 'sBYX' as a staking receipt. You will then redeem this token to unstake your BYX.
- BYX staking rewards are in BYX. They are generated each block. APR depends on the TVL.
- When staking ETH, no token will be redeemed. Your stake will be registered in your account in the smart contract.
- ETH staking rewards are in BYX. They are generated each day. APR is fixed. Rewards in BYX depends on ETH and BYX price.
- As BYX price is not in the chainlink data feeds, we use UNIUSD price instead.

## Tech
- Solidity - Smart contract language
- openzeppelin - contracts and test helpers
- chainlink - contracts for data feed
- Truffle - Development environment
- Ganache - local blockchain server
- web3.js - javascript library for blockchain integration
- React.js - javascript front-end library
- Node.js - javascript server
- Mocha - test Framework
- Chai - test assertion library
- eth-gas-reporter - gas reporter
- GitHub Pages - Deployment tool
- Metamask - Browser wallet

## Links
### dApp 
 - https://yvestoiser.github.io/Alyra-project4-deFi-dApp/
### Video Demo

## Tests
### Manual Test
You can test this dApp on Kovan network.

### Unit tests
You can find below the documentation of these tests.


## How to
- You need to have node.js installed
- run a local blockchain server
```sh
ganache
```
- in another terminal run the test script
```sh
truffle test
```

## Tests results
44 tests. 44 passing (7m).

### List of tests

    Contract: BYX
    
        Getters    
          ✓ should return token name correctly (8ms)    
          ✓ should return token symbol correctly (6ms)    
          ✓ should return max total supply correctly (6ms)    
          
        Total Supply & Mint    
          ✓ should return total supply correctly (0 value) (14ms)    
          ✓ should return total supply correctly after mint (1000 value) (28ms, 73846 gas)    
          ✓ should return total supply correctly after multiple mint (3000 value) (74ms, 187338 gas)    
          ✓ should mint token on appropriate addresses (70ms, 187338 gas)    
          ✓ should not mint if not by owner (22ms, 24835 gas)    
          ✓ should not mint if max total supply has been reached (49ms, 103151 gas)    

    Contract: BYXStakingManager   
     
        Staking    
          ✓ should not stake with insufficient allowance (48ms, 81440 gas)    
          ✓ should not stake with insufficient fund (23ms, 30369 gas)    
          ✓ should not stake with null amount (38ms, 77123 gas)    
          ✓ should stake correctly (82ms, 158109 gas)    
          
        UnStaking    
          ✓ should not unstake with insufficient allowance (40ms, 81399 gas)    
          ✓ should not unstake with insufficient fund (20ms, 30304 gas)    
          ✓ should not unstake with null amount (21ms, 30147 gas)    
          ✓ should unstake correctly (90ms, 137014 gas)    
          
        Rewards    
          ✓ should reward correctly (276ms, 590270 gas)    
          ✓ should reward correctly with full stake (364ms, 614966 gas)    
          ✓ should increase reward with new block (286ms, 590270 gas)    
          
        Pool info    
          ✓ should return pool value correctly after initialization (34ms, 106607 gas)    
          ✓ should return pool value correctly after staking (86ms, 264728 gas)    
          ✓ should return APR correctly with initial stake (34ms, 106607 gas)    
          ✓ should return APR correctly with bigger initial stake (36ms, 106619 gas)    
          ✓ should return APR correctly with even bigger initial stake (37ms, 106619 gas)    

    Contract: ETHStakingManager   
     
        Staking    
          ✓ should not stake with insufficient amount (25ms, 95357 gas)    
          ✓ should stake correctly (44ms, 166019 gas)    
          ✓ should emit appropriate event when staking (29ms, 166019 gas)  
            
        UnStaking    
          ✓ should not unstake more than available (44ms, 190220 gas)    
          ✓ should unstake correctly (45ms, 199470 gas)    
          ✓ should emit appropriate event when unstaking (55ms, 199470 gas)    
          
        Rewards    
          ✓ should not claim rewards if none available (48ms, 192132 gas)    
          ✓ should not have rewards before mandatory time (4052ms, 241080 gas)    
          ✓ should update rewards, have rewards after mandatory time, claim rewards correctly if available and emit appropriate event (4140ms, 388769 gas)    

    Contract: sBYX    
    
        Getters    
          ✓ should return token name correctly (5ms)    
          ✓ should return token symbol correctly (5ms)    
          
        Mint and authorization    
          ✓ should not mint if not authorized (17ms, 24906 gas)    
          ✓ should not authorize by wrong address (17ms, 24495 gas)    
          ✓ should mint if authorized (18ms, 46474 gas)    
          
        Burn & Burn From    
          ✓ should not burn if not owner (34ms, 95794 gas)    
          ✓ should be able to burn if owner (37ms, 100780 gas)    
          ✓ should not burn if balance is insufficient (17ms, 26718 gas)    
          ✓ should not burn from if not authorized (37ms, 96343 gas)    
          ✓ should be able to burn from if authorized (37ms, 101187 gas)    

### eth-gas-reporter

- Solc version: 0.8.14+commit.80d49f37
- Optimizer enabled: false 
- Runs: 200
- Block limit: 6718946 gas

| Methods | | | | | |
| ------ | ------ | ------ | ------ | ------ | ------ |
| Contract | Method | Min | Max | Avg | # calls |  
| BYX | approve | 46899 | 46923 | 46912 | 14 |
| BYX | mint | 56746 | 73858 | 62706 | 89 |
| BYXStakingManager | depositStake | 106422 | 111210 | 110526 | 14 |
| BYXStakingManager | initializePool | 106607 | 106619 | 106609 | 19 |
| BYXStakingManager | withdrawStake | 90079 | 107191 | 94746 | 11 |
| ETHStakingManager | claimRewards | - | - | 62016 | 1 |
| ETHStakingManager | depositStake | 75061 | 160746 | 94806 | 13 |
| ETHStakingManager | withdrawStake | - | - | 33451 | 4 |
| sBYX | approve | 46911 | 46947 | 46935 | 8 |
| sBYX | authorize | 46462 | 46474 | 46473 | 23 |
| sBYX | burn | - | - | 29321 | 2 |
| sBYX | burnFrom | - | - | 29728 | 1 |
| sBYX | mint | - | - | 71459 | 5 |
| Deployments |  |  |  |  | % of limit |
| BYX |  | - | - | 1684352 | 25.1 %  |
| BYXStakingManager |  | 1615861 | 1615873 | 1615872 | 24 %  |
| ETHStakingManager |  | 1320868 | 1320880 | 1320876 | 19.7 %  |
| MockedPriceProvider |  | - | - | 368634 | 5.5 %  |
| sBYX |  | - | - | 1919794 | 28.6 %  |


