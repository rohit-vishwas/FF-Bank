// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.2;
// pragma solidity >=0.5.0;

contract RWD{
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000; // this is 1 million tokens{total 18+6 0s}
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    constructor(){
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address _spender , uint256 _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    function transfer(address _to ,uint value) public returns(bool success){
        //check for the sufficient balance
        require(balanceOf[msg.sender] >= value);

        //user who called will have money deducted from there accounts
        balanceOf[msg.sender] -= value;
        //adding money to the receiver
        balanceOf[_to] += value;
        //saving the details on blockchain
        emit Transfer(msg.sender, _to, value);
    
        return true;        
    }

    function transferFrom(address _from , address _to  , uint _value) public returns(bool success){
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);  
        return true;
    }
}