import React, { Component } from 'react';
import Web3 from 'web3';
import Nav from './nav';
import storehash from './storehash';
import storehash2 from './storehash2';
import {Redirect} from 'react-router-dom';
const provider = window.web3.currentProvider ; 
provider.enable(); 
const web3 = new Web3(provider);

class Order extends Component {
  
  constructor(){
    super();
    this.state={
      orders : '',
      ethAddress:'',
      transactionHash:'',
      transactionHash2:'',
      getid : ''
    }
  }

  componentWillMount() {
    console.log('came2');
    fetch('/fetchorders')
    .then(res => res.json())
    .then(data => this.setState({orders:data}));
  }
  
  
  //admin approval - storage of hash
   handleClick = async (hash) => {
    console.log('called');
    const account = await web3.eth.getAccounts();

    const ethAddress= await storehash.options.address;
    this.setState({ethAddress});

    storehash.methods.sendHash(hash).send({
        from:account[0],
        gas:1000000
      }, (error, transactionHash) => {
        console.log('called1');
        console.log(error);
        console.log(transactionHash);
        this.setState({transactionHash});
      });  

    }

    handleId = async (id,hash) => {
    const account = await web3.eth.getAccounts();
    storehash.methods.getId().call({
          from:account[0],
            gas:1000000
          }, (error, result) => {
            console.log('called ID');
            console.log(error);
            console.log(result.toNumber());
            this.setState({getid : result.toNumber()});
            if(this.state.getid){
             fetch('/returntx/' + '/' + id + '/' + hash + '/' + this.state.transactionHash + '/' + this.state.getid)
             .then(res => res.json());
           }
        }); 
    }

    handleTransfer = async (oid) => {
    
    console.log('called3');
    const account = await web3.eth.getAccounts();

    const ethAddress= await storehash.options.address;
    this.setState({ethAddress});

    web3.eth.sendTransaction({from:'0xc294B89Ae0a29c0A6C535dbB6390652208A512a0', to:account[0], 
      value: web3.utils.toWei('0.1', 'ether')}
      , (error, transactionHash2) => {
        console.log('called');
        console.log(error);
        console.log(transactionHash2);
        this.setState({transactionHash2});
        if(this.state.transactionHash2){
          fetch('/toipfs/' + oid)
          .then(res => res.json());
        }
      }
      ); 
    } 


  render() {
     const orders = this.state.orders;
     if(orders.length > 0){
        return (
            <div>
            <Nav />
            <br /> <br/><br/>
            <table style={{marginLeft:30,width:1200}} className="table table-hover">
            <thead>
            <tr>
            <th scope="col">Order</th>
            <th scope="col">Approve</th>
            </tr>
            </thead>
            <tbody>
            { orders.map(order => {
              return (<tr>
              <th scope="row">{order.order_id}</th>
              <td>
              <button 
              className='btn btn-secondary' 
              onClick = {() => {this.handleClick(order.convertedHash)}} >
                Approve
              </button>
              <button   className='btn btn-secondary'  
              onClick = {() => this.handleId(order.order_id,order.convertedHash)} >Check ID</button>
              <button   className='btn btn-secondary' >From Buyer - Tax({order.cost})</button>
              <button   className='btn btn-secondary'  
              onClick = {() => {this.handleTransfer(order.order_id)}}>To Seller</button>
              </td>
              </tr>
              )
            })}
            </tbody>
            </table>
            </div>
            );
    } else {
    return (
      <div>
      <Nav />
     <p>No orders</p>
      </div>
    );
  }
}}

export default Order;
