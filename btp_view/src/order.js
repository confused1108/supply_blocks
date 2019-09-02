import React, { Component } from 'react';
import Web3 from 'web3';
import Nav from './nav';
import storehash from './storehash';
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
      getid : ''
    }
  }

  componentWillMount() {
    console.log('came2');
    fetch('/fetchorders')
    .then(res => res.json())
    .then(data => this.setState({orders:data}));
  }
  
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

      //   if(this.state.transactionHash){
      // //   fetch('/returntx/' + hash + '/' + this.state.transactionHash)
      // //   .then(res => res.json());
      //  }
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

  render() {
     const orders = this.state.orders;
     if(orders.length > 0){
        return (
            <div>
            <Nav />
            <br /> <br/><br/>
            <table className="table table-hover">
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
              <button onClick = {() => this.handleId(order.order_id,order.convertedHash)} >Check ID</button>
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
