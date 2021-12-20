import React, {Component} from 'react'
import './App.css'
import Navbar from "./Navbar";
import Web3 from 'web3';

//importing the contracts
import Tether from '../truffle_abis/Tether.json'
import Reward from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'

import Main from './Main'

// import Airdrop from './Airdrop'

class App extends Component {
    
    async UNSAFE_componentWillMount(){
        await this.loadWeb3();
        await this.loadBlockchainData();
    }
    async loadWeb3(){ 
        if(window.ethereum){
            //if ethereum is present
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            console.log("ethereum available");

        }
        else if(window.web3){
            //if web3 is present but not ethereum
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else{
            window.alert('No Metamask Detected! Try adding Metamask');
        }

    }
    async loadTetherContract(networkId , web3){
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi , tetherData.address)
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call() //adding call() is needed
            this.setState({tetherBalance: tetherBalance.toString()})

            console.log({balance: tetherBalance})
        }
        else{
            window.alert('Error! The tether contract is not deployed to the network')
        }

    }
    async loadRewardContract(networkId , web3){
        const rewardData = Reward.networks[networkId]
        if(rewardData){
            const rwd = new web3.eth.Contract(Reward.abi , rewardData.address)
            this.setState({rwd})
            let rewardBalance = await rwd.methods.balanceOf(this.state.account).call()
            console.log(rewardBalance)
            this.setState({rewardBalance : rewardBalance.toString()})
            console.log({rwdBalance: rewardBalance})
        }
        else{
            window.alert('Error! The reward contract is not deployed to the network')
        }

    }
    async loadDecentralBankContract(networkId , web3){
        const decentralBankData = DecentralBank.networks[networkId]
        if(decentralBankData){
            const decentralBank = new web3.eth.Contract(DecentralBank.abi , decentralBankData.address)
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance : stakingBalance.toString()})
            console.log({stakingBalance: stakingBalance})
        }
        else{
            window.alert('Error! The DecentralBank contract is not deployed to the network')
        }
    }
    async loadBlockchainData(){
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        // console.log(account)
        this.setState({account : account[0]})
        // console.log(account[0])
        // console.log(account[1])
        console.log({Acchch: account});

        //retreiving the network id, which for Ganache netwowk is 5777
        const networkId = await web3.eth.net.getId()
        console.log(networkId , 'Network Id')

        //loading the tether contract
        await this.loadTetherContract(networkId , web3)

        //loading the reward contract
        await this.loadRewardContract(networkId , web3)

        //loading the decentral bank contract
        await this.loadDecentralBankContract(networkId , web3)
      
        // await this.airdropRewardRelease()
        //set the loading status to false
        this.setState({loading : false})

    }
    //functions for staking and unstaking
    //leveraging our decentralBank contract- deposit tokens and unstaking
    //depositTokens transferFrom
    //function approve transaction hash
    stakeTokens = (amount)=>{
        // there are still some syncing or metamask related bugs, that doesn't yet have solutions(or didn't found one)
        
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address , amount).send({from: this.state.account})
        this.state.tether.methods.approve(this.state.decentralBank._address , amount).send({from: this.state.account}).on('transactionHash', (hash)=>{
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash)=>{
            this.setState({loading:false})
        })
        })

        // this.state.tether.methods.approve(this.state.decentralBank._address,amount).call(function (err , res){
        //     if (err){
        //         console.log("Some error occurred" , err)
        //     }
        //     else{
        //     }
        // })
        // this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account} ,function (err,res){
        //     if(!err){
        //         this.setState({loading: false})
        //     }
        //     else{
        //         console.log("Some error occurred" , err)
        //     }
        // })

    // this.setState({loading: false})
    }    
    //now unstake the tokens
    unstakeTokens = ()=>{
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash' , (hash)=>{
            this.setState({loading: false})
        })
    }

    constructor(props) {
        super(props)
        this.state ={
            account : '0x0',
            tether : {}, 
            rwd : {},
            decentralBank : {},
            tetherBalance : '0',
            rwdBalance : '0',
            stakingBalance : '0',
            loading : true, //for loading screen
        }
    }

    //React code goes here
    render() {
        let MainContent
        {
            this.state.loading ? MainContent = 
            <p id = 'loader' className = "text-center" style = {{margin: '30px'}}>
                LOADING...
            </p>: MainContent = 
                                <Main
                                tetherBalance = {this.state.tetherBalance}
                                rwdBalance = {this.state.rwdBalance}
                                stakingBalance = {this.state.stakingBalance}  
                                stakeTokens = {this.stakeTokens}    
                                unstakeTokens = {this.unstakeTokens}
                                />
        }

        return (
            <div>
                <Navbar account={this.state.account}/>
                    <div className='container-fluid mt-5'>
                        <div className = "row">
                            <main role = "main" className = "col-lg-12 ml-auto mr-auto" style={{maxWidth : '600px' , minHeight:'100vm'}}>
                                <div>
                                    {MainContent}
                                </div>
                            </main>
                        </div>

                    </div>
            </div>
        )
    }
}

export default App;