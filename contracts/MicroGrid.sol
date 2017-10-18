pragma solidity ^0.4.11;


contract MicroGrid {
    mapping (address => uint256) storeage;
    mapping (address => bool) public pays;

    uint256 public cost;
    uint256 public totalcost;
    uint256 public power;
    address public owner;
    address public sender;
    uint256 public refund;
    uint256 public total;
    bool public pay = false;
    uint256 public valueOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function MicroGrid (uint256 _power, uint256 _cost) {
        cost = _cost;
        power = _power;
        owner = msg.sender;
    }
    function priceOfPower(uint256 _power) constant returns (uint256) {
        return _power * cost;
    }



    function() payable {
        totalcost = priceOfPower(power) * 1000000000000000000;
        require(msg.value >= totalcost);
        require(pay == false);
        sender = msg.sender;
    
        owner.transfer(totalcost);
        storeage[sender] += power;
        vaildPayment();

        if ( this.balance > 0 ) {  
            refund = this.balance;
            sender.transfer(this.balance);                    
        }
    }

    function vaildPayment () returns (bool) {
         pay = true;
         return pay;
    }

    function vaildTransferOfPower (address _consumer) constant returns(uint256) {
        return storeage[_consumer];
    }
   
    
}
