// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.2;
// pragma solidity >=0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    //here we would need to have access to Reward token and Tether Tokens

    string public name = "DecentralBank";
    address public owner;

    Tether public tether;
    RWD public rwd;

    constructor(Tether _tether , RWD _rwd) {
        owner = msg.sender;
        tether = _tether;
        rwd = _rwd;    
    }    

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    
    //this is staking function
    function depositTokens(uint _amount) public{
        require(_amount > 0 , "amount can't be non positive");
 
        //transfer Tether tokens to this contract address for staking purposes
        tether.transferFrom(msg.sender, address(this), _amount);
        //just FYI: msg.sender calls this contract and when we call transferFrom() here
        //that means for Tether.sol contract DecentralBank is the msg.sender
        /*Link for reference:
        https://ethereum.stackexchange.com/questions/28972/who-is-msg-sender-when-calling-a-contract-from-a-contract/28977        
        */ 
        //update the staking balance
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

    }
    function unstakeTokens() public{
        //credits the token deposited by the user back to them
        uint balance = stakingBalance[msg.sender];
        require(balance > 0 , "Balance can't be negative");

        //transfer the tokens from the bank to the speicified contract address
        tether.transfer(msg.sender, balance); //this transfers money from the bank to the specified address

        //reset user staked tokens
        stakingBalance[msg.sender] -= balance; //essentially turns it to 0

        //update isStaking stat
        isStaking[msg.sender] = false; 
    }
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    function getIncentive(uint balance) public pure returns(uint){
        //logic for allotting the rewards based on staking amount
        return balance/9;
    }

    function issueTokens() public onlyOwner{
        for(uint i = 0 ; i < stakers.length ; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            uint reward = getIncentive(balance);
            
            if(reward > 0){
                rwd.transfer(recipient, reward);
            }
        }
    }
}