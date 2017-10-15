
var MetaCoin = artifacts.require("./MicroGrid.sol");

module.exports = function(deployer) {
  deployer.deploy(MetaCoin,10,15);
};
