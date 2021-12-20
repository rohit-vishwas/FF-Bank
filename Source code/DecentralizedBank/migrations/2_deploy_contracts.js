const Tether = artifacts.require('Tether'); // no need to give path: truffle-config.js handles it
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function(deployer , network , accounts){
    //mock tether contract deploy
    await deployer.deploy(Tether);
    const tether = await Tether.deployed()

    //deploying Reward token contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed()

    //deploying decentralBank contract
    await deployer.deploy(DecentralBank , tether.address , rwd.address);
    const decentralBank = await DecentralBank.deployed();

    //transfer all RWD tokens to the decentral bank
    await rwd.transfer(decentralBank.address , '1000000000000000000000000'); //1 million tokens (24 0s)

    //distribute 100 tether tokens to investor
    //we are here assuming the second address in Ganache to be the investor's address
    await tether.transfer(accounts[1] , "100000000000000000000"); //20 0s

    // await tether.transfer(accounts[1], "100000000000000000000", {from : accounts[0]});


}