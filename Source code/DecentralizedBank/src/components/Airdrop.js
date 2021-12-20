import React from 'react'
import {Component} from 'react'
import {render} from 'react-dom'
// import issueRewards from '/home/varun/BlockchainCourse/Section8/decentralizedBank/scripts/./issue-tokens'
// import {issueRewards} from 'issue-tokens'
// import './issue-tokens'
//this would have a timer, that keeps the track of the customers staking time
//and 
// const DecentralBank = artifacts.require('DecentralBank');

class Airdrop extends Component{
    
    constructor(){
        super()
        this.state = {time: {} , seconds: 100000}
        this.timer = 0
        this.startTimer = this.startTimer.bind(this)
        this.countDown = this.countDown.bind(this)
    }
    startTimer(){
        if(this.timer == 0 && this.state.seconds > 0){
            this.timer = setInterval(this.countDown , 1000)
        }
    }
    countDown(){
        let seconds = this.state.seconds - 1
        this.setState({time: this.secondsToTime(seconds) , seconds: seconds})

        if(seconds == 0){
            clearInterval(this.timer)
        }
    }
    secondsToTime(sec){
        let hours = Math.floor(sec/3600)
        let minutes = Math.floor((sec%3600)/60)
        let seconds = Math.ceil((sec%3600)%60)

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        }
        return obj
    }
    componentDidMount(){
        let leftTimeVar = this.secondsToTime(this.state.seconds)
        this.setState({time: leftTimeVar})
    }
    airdropTimerBegin(){
        let stakedAmount = this.props.stakingBalance
        if(stakedAmount >= "50000000000000000000"){
            this.startTimer()
        }
    }
    async airdropRewardRelease(){
        if(this.state.time.m == 0 && this.state.time.s == 0){
            ///home/varun/BlockchainCourse/Section8/decentralizedBank/scripts/issue-tokens.js
            // issueRewards()
            // let decentralBank = await DecentralBank.deployed();
            // let decentralBank = this.props.decentralBank
            // await decentralBank.methods.issueTokens().call();
            // console.log('Tokens have been assigned successfully!');
            
            console.log(this.props.rwdBalance)
        }
    }
    render(){
        this.airdropTimerBegin()
        // this.airdropRewardRelease()
        return(
            <div style = {{color: 'black'}}>
                {this.state.time.h} hr: {this.state.time.m} min:{this.state.time.s} sec
            </div>
        )
    }
}
export default Airdrop;