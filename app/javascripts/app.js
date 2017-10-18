
import "../stylesheets/app.css";


import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'


import microgrid_artifacts from '../../build/contracts/MicroGrid.json'


var MicroGrid = contract(microgrid_artifacts);

var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    MicroGrid.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance1();


    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance1: function() {
    var self = this;
    var power;
    var vaild = false;

    var meta;
    MicroGrid.deployed().then(function(instance) {
      meta = instance;

      meta.power().then(function(value){
        power = value.valueOf();
        var addOfvalue = document.getElementById("power-1");
        addOfvalue.innerHTML = power;
      
      var addressOfOwner = document.getElementById("address-1");
      addressOfOwner.innerHTML = meta.address;

      meta.pay().then(function(value){
        var statusOfPay = document.getElementById("status-1");
        if(value.valueOf()==false){
        statusOfPay.innerHTML = "avilable";
        }else
        statusOfPay.innerHTML = "sold";
      })

      meta.refund().then(function(value){
        var refunds = document.getElementById("refund");
      refunds.innerHTML = value.valueOf();
      })



      return meta.priceOfPower.call(power, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("price-1");
      balance_element.innerHTML = value.valueOf();
    })
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },


  sendCoin: function() {
    var self = this;

    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MicroGrid.deployed().then(function(instance) {
      meta = instance;
      return meta.vaildTransferOfPower.call(receiver);
    }).then(function(value) {
      var balance_element = document.getElementById("storeage");
      balance_element.innerHTML = value.valueOf();
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance1();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error verify storeage; see log.");
    });
  },

  };

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
