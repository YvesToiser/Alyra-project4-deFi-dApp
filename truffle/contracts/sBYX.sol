// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC20MintableAndBurnable.sol";

contract sBYX is Ownable, ERC20, IERC20MintableAndBurnable{

    /// if true, addresses will be authorized to mint sBYX.
    mapping (address => bool) authorizedAddress;

    /// Events emitted in case of bad call or unexpected depot on the contract
    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    /*************************************************************************************************/
    /*                                            MODIFIERS                                          */
    /*************************************************************************************************/

    /**
     * @dev Throws if called by any account not authorized.
     */
    modifier onlyAuthorized() {
        require(authorizedAddress[msg.sender] == true, "caller is not authorized");
        _;
    }

    /*************************************************************************************************/
    /*                                        SPECIAL FUNCTIONS                                      */
    /*************************************************************************************************/

    constructor() ERC20("Staked Byx", "sBYX") {}

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
     * @notice Authorize an Address. This address will be authorized to mint sBYX (BYXStakingManager contract)
     *
     * @dev Authorize an Address. This address will be authorized to mint sBYX (BYXStakingManager contract)
     *
     * @param _addr the address to authorize.
     */
    function authorize(address _addr) external onlyOwner {
        authorizedAddress[_addr] = true;
    }

    /**
    * @notice creation  of a ERC20 Byx token
    *
    * @dev minting of Byx token
    *
    * @param _to the recipient of token
    *
    * @param _amount the amount
    */
    function mint(address _to, uint256 _amount) external onlyAuthorized {
        _mint(_to, _amount);
    }

    /**
    * @dev Destroys `amount` tokens from the caller.
    * See {ERC20-_burn}.
    *
    * @param _amount.
    */
    function burn(uint256 _amount) public onlyOwner {
        _burn(_msgSender(), _amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's allowance.
     * See {ERC20-_burn} and {ERC20-allowance}.
     * Requirements:
     * - the caller must have allowance for ``accounts``'s tokens of at least `amount`.
     *
     * @param _account.
     *
     * @param _amount.
     */
    function burnFrom(address _account, uint256 _amount) public onlyAuthorized {
        _burn(_account, _amount);
    }

}
