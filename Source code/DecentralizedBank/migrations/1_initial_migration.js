const Migrations = artifacts.require('Migrations'); // no need to give path: truffle-config.js handles it

module.exports = function(deployer){
    deployer.deploy(Migrations);
}