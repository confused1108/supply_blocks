import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Nav from './nav';
import Web3 from 'web3';
import storehash from './storehash';
import {Redirect} from 'react-router-dom';
const provider = window.web3.currentProvider ; 
provider.enable(); 
const web3 = new Web3(provider);

class Buyer extends Component {

   constructor(){
    super();
    this.state={
      orders:'',
      ethAddress:'',
      transactionHash:''
    }
  }

  componentWillMount(){
    const id = this.props.match.params.id;

     fetch('/tobuyer/' + id)
    .then(res => res.json())
    .then(data => this.setState({orders : data}));
  }

  handleClick = async () => {
    
    console.log('called1');
    const account = await web3.eth.getAccounts();

    const ethAddress= await storehash.options.address;
    this.setState({ethAddress});

    web3.eth.sendTransaction({from:account[0], to:'0xc294B89Ae0a29c0A6C535dbB6390652208A512a0', 
      value: web3.utils.toWei('0.1', 'ether')}
      , (error, transactionHash) => {
        console.log('called');
        console.log(error);
        console.log(transactionHash);
        this.setState({transactionHash});
      }
      ); 
    } 

  render() {
    const orders = this.state.orders;
     if(orders.length >0){
        return (
            <div>
            <Nav />
            <h1>Hello</h1>
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
              className='btn btn-secondary'   onClick = {() => {this.handleClick()}} >
                Approve
              </button>
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

export default Buyer;
