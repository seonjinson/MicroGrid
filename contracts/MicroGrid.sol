pragma solidity ^0.4.2;


// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MicroGrid {
    mapping (address => uint) balances;
    mapping (address => uint) storeage;
    mapping (address => bool) public pays;

    uint256 public cost;
    uint256 public totalcost;
    uint256 public power;
    address public owner;
    address public receiver;
    uint256 public refund;
    bool public pay = false;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function MicroGrid (uint256 _power, uint256 _cost) {
        balances[tx.origin] = 10000;
        cost = _cost;
        power = _power;
        owner = msg.sender;
    }
    function priceOfPower(uint256 _power) constant returns (uint256) {
        totalcost = _power * cost;
        return totalcost;
    }



    function() payable {
        require(msg.value >= totalcost);
        require(pay == false);

        owner.transfer(msg.value);
        storeage[msg.sender] += power;
        vaildPayment(msg.sender);
    }

    function vaildPayment (address _consumer) constant returns(bool) {
         pays[_consumer] == true;
         pay = true;
         return pay;
    }

    function vaildTransferOfPower (address _consumer) constant returns(uint256) {
        return storeage[_consumer];
    }
    
    
}
