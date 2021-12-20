import React, {Component} from 'react'
import tether_image from '../tether.png'
import Airdrop from './Airdrop'

class Main extends Component {
    tokens_to_ether(count){
        return window.web3.utils.fromWei(count, 'Ether');
    }
    render() {
        // console.log(this.props.stakingBalance , "Props Staking Balance")
        // console.log(this.props.tetherBalance , "Props Tether Balance")
        // console.log(this.props.rwdBalance , "Props RWD Balance")
        return (
            <div id = "content" className = "mt-3">
                <table className = "table text-muted text-center">
                    <thead>
                        <tr style = {{color : 'black'}}> 
                            <th scope = "col">Staking Balance</th>
                            <th scopr = "col">Reward Balance</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr style = {{color : 'black'}}>
                            <td>{this.tokens_to_ether(this.props.stakingBalance)} USDT</td>
                            <td>{this.tokens_to_ether(this.props.rwdBalance)} RWD</td>
                        </tr>
                    </tbody>
                </table>

                <div className = "card mb-2" style = {{opacity: 0.9}}>
                    <form 
                    onSubmit={(event)=>{
                        event.preventDefault()
                        let amount
                        amount = this.input.value.toString()
                        amount = window.web3.utils.toWei(amount , 'Ether')
                        console.log({amnt : amount})
                        this.props.stakeTokens(amount)
                    }}
                    
                    className = "mb-3">
                        <div style = {{borderSpacing: '0 1em'}}>
                            <label className = "float-left" style = {{marginLeft: '15px'}}>
                                <b>
                                    Stake Tokens
                                </b>
                            </label>
                            <span className = "float-right" style = {{marginRight: '8px'}}>
                                Balance: {this.tokens_to_ether(this.props.tetherBalance)}
                            </span>
                            <div className = "input-group mb-4">
                                <input 
                                ref={(input) =>{this.input = input}}
                                type = "text" placeholder = "0" required/>
                                <div className = "input-group-open">
                                    <div className = "input-group-text">
                                        <img alt = 'tether_image' src = {tether_image} height = '32'/>
                                        &nbsp;&nbsp;USDT
                                    </div>

                                </div>
                            </div>

                            <button type = "submit" className = "btn btn-primary btn-lg btn-block">DEPOSIT</button>
                        </div>
                    </form>
                    <button 
                    type = "submit"
                    onClick = {(event)=>{
                        event.preventDefault(
                            this.props.unstakeTokens()
                        )
                    }} 
                    className = "btn btn-primary btn-lg btn-block">WITHDRAWL</button>
                    <div className = "card-body text-center" style = {{color:'blue'}}>
                        AIRDROP 
                        <Airdrop stakingBalance={this.props.stakingBalance}/>
                    </div>
                </div>

            </div>
        )
    }
}

export default Main;