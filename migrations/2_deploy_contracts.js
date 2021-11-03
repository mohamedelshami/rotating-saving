var RotatingSaving = artifacts.require("./RotatingSaving.sol");

module.exports = function(deployer) {
  deployer.deploy(RotatingSaving, 10);
};
