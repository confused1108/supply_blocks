import React, { Component } from 'react';
import Web3 from 'web3';
import storehash from './storehash';
//const provider = new HDWalletProvider(mnemonic, "rinkeby.infura.io/v3/9568c28229d64596ad520f51603765f2", 4);
//const infura = "https:rinkeby.infura.io/v3/9568c28229d64596ad520f51603765f2";
//const web3 = new Web3(new Web3.providers.HttpProvider(infura));
const provider = window.web3.currentProvider ; 
provider.enable(); 
const web3 = new Web3(provider);

class NextCompo extends Component {

    constructor(){
      super()
      this.state = {
        ethAddress:'',
        transactionHash:''
      }
    }
  
     
     componentWillMount = async () => {

        const account = await web3.eth.getAccounts();

        const ethAddress= await storehash.options.address;
        this.setState({ethAddress});

         storehash.methods.sendHash(this.props.hash).send({
            from:account[0],
            gas:1000000
          }, (error, transactionHash) => {
            console.log('called');
            console.log(error);
            console.log(transactionHash);
            this.setState({transactionHash});
          });  

    }
  
    render() {

      return (
        <div>
            
            <p>Address = {this.state.ethAddress}</p>
            <p>Transaction Hash = {this.state.transactionHash}</p>
        </div>
      );
    }
}

export default NextCompo;
