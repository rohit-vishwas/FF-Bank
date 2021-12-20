
const Tether = artifacts.require('Tether'); // no need to give path: truffle-config.js handles it
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require("DecentralBank");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank' , (accounts) => {
    //code for testing goes here

    let tether , rwd , decentralBank;

    function tokens(count){
        return web3.utils.toWei(count, 'ether');
    }
    before(async () => {
        // this section of code runs before any portion within
        // before() can be placed anywhere within this section
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(tether.address , rwd.address);

        //we will be testing whether token transfer is successfull

        //tranfer all the tokens to decentralBank
        await rwd.transfer(decentralBank.address, tokens('1000000'));

        //tranfer 100 tokens to investor/customer
        await tether.transfer(accounts[1], tokens('100'), {from : accounts[0]});
    })

    describe('Mock Tether Deployment' , async ()=>{
        it('matches name successfully' , async ()=>{
            const name = await tether.name();
            assert.equal(name,'Mock Tether Token');
        })
    })


    describe('Reward Token Deployment' , async () => {
        it('matches name successfully' , async () => { 
            const name = await rwd.name();
            assert.equal(name , 'Reward Token');
        })
    })

    describe('Decentral Bank Deployment' , async () => {
        it('matches name successfully' , async ()=>{
            const name = await decentralBank.name();
            assert.equal(name , 'DecentralBank');
        })

        it('contract has tokens' , async () =>{
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance , tokens('1000000'));
        })

        describe('Yield Farming' , async () =>{
            it('reward tokens for staking' , async ()=>{
                let result = await tether.balanceOf(accounts[1]);
                assert.equal(result.toString() , tokens('100') , 'Custome/Investor mock wallet balance before staking');

                //checking staking for customer

                //allocating decentralBank and allowance of 100 tether tokens from account[1]
                await tether.approve(decentralBank.address, tokens('100') ,{from: accounts[1]});
                
                await decentralBank.depositTokens(tokens('100') , {from : accounts[1]});

                //after depositTokens check for the updated value of the customer
                result = await tether.balanceOf(accounts[1]);
                assert.equal(result.toString() , tokens('0') , 'Custome/Investor mock wallet balance after staking 100 tokens');

                //after customer deposit balance of the decentralBank
                result = await tether.balanceOf(decentralBank.address);
                assert.equal(result.toString() , tokens('100') , 'DecentralBank mock wallet balance after cutomer staking 100 tokens');
                
                // staking status
                result = await decentralBank.isStaking(accounts[1]);
                assert.equal(result.toString() , "true", 'customers staking status')
                
                //reward allotment test
                await decentralBank.issueTokens({from:accounts[0]});

                //check if only ownere is permitted to allot rewards
                await decentralBank.issueTokens({from : accounts[1]}).should.be.rejected; // accounts[1] for investor/customer

                //unstake tokens test
                await decentralBank.unstakeTokens({from : accounts[1]});

                //after unstakeTokens check for the updated value of the customer
                result = await tether.balanceOf(accounts[1]);
                assert.equal(result.toString() , tokens('100') , 'Custome/Investor mock wallet balance after unStaking 100 tokens');

                //after customer unstake, balance of the decentralBank
                result = await tether.balanceOf(decentralBank.address);
                assert.equal(result.toString() , tokens('0') , 'DecentralBank mock wallet balance after cutomer unStaking 100 tokens');
                
                // staking status after unstake
                result = await decentralBank.isStaking(accounts[1]);
                assert.equal(result.toString() , "false", 'customers staking status')
                
            })
        })
    })

})

