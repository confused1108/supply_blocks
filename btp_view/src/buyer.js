import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Nav from './nav';
import Web3 from 'web3';
import storehash from './storehash';
import storehash2 from './storehash2';
import {Redirect} from 'react-router-dom';
const provider = window.web3.currentProvider ; 
provider.enable(); 
const web3 = new Web3(provider);

class Buyer extends Component {

   constructor(){
    super();
    this.state={
      orders:'',
      order_id:'',
      ethAddress:'',
      hash:'',
      signdetails : '',
      tx:'',
      transactionHash:'',
      transactionHash2:''
    }
  }

  componentWillMount(){
    const id = this.props.match.params.id;

     fetch('/tobuyer/' + id)
    .then(res => res.json())
    .then(data => this.setState({orders : data}));
  }

  handleKeys = (id,id2) => {
    fetch('/generateKeys/' + id + '/' + id2)
      .catch(err => console.log(err));
  }

  handleClick = (id,id2) => {
    console.log(id);
    fetch('/generateKeys/' + id + '/' + id2)
      .then(res => res.json())
      .catch(err => console.log(err));
  }


  // handleAccess = (tid , id , flag) => {
  //   fetch('/checkTrans/' + tid + '/' + id + '/' + flag)
  //   .then(res => res.json())
  //   .then(data => this.setState({hash:data[0]}));
  // }

  handleAppr = async () => {
    
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

  handleTransfer = async () => {
    
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
      }
      ); 
    } 

    contract = async (data) => {

    var oid = this.state.order_id;
    const account = await web3.eth.getAccounts();
    console.log(data);
    var ans = (data.string).toString();
    var cid = data.cid;

    if(data){
    storehash2.methods.addSignature(ans, data.idd , cid).send({
        from:account[0],
        gas:1000000
      }, (error, result) => {
        console.log('called');
        console.log(error);
        console.log(result);
        if(result){
          this.setState({tx : result});
          fetch('/returnSign/' + this.state.tx + '/' + oid + '/' + cid + '/' + this.props.match.params.id)
        }
      }); 

     }
    }


  signature = (tid , cid) => {
    //var odr_id = this.props.location.state.odr_id;
    var odr_id = this.state.order_id;
    console.log(odr_id);
    var forlast = 'no';
    fetch('/sign/' + tid + '/' + cid + '/' + odr_id + '/' + forlast)
      .then(res => res.json())
      .then(data => {
        console.log(data);
         this.setState({signdetails : data });
         this.contract(this.state.signdetails);
      });
    }

  render() {


      if(this.state.orders){
      var orders = this.state.orders;
      console.log(orders);

      var compo = (orders && orders.map(order => {
        if(order.flag=='true'){
          return  (
            <div>
            <div className="card-body">
              <h6 className="card-title"> For Order : {order.order_id}</h6>
              <h6 className="card-title"> Msg : {order.msgs} </h6>
              <button className='btn btn-secondary'  onClick = {() => this.handleClick(order.transporter_id,order.order_id)} >
                Generate Keys 
              </button>
              <button className='btn btn-secondary' onClick={() => {this.setState({order_id : order.order_id})}} >
                Scan Order_id 
              </button>
              <button className='btn btn-secondary'  
              onClick = {() => this.signature(order.transporter_id,order.noInChain,this.state.forlast)}>
                If Verified Sign
              </button>
              <button className='btn btn-secondary'   onClick = {() => {this.handleTransfer()}} >
                Complete Transfer
              </button>
            </div>
          </div>
            )
        } else if(order.flag=='false') {
          return (
          <div className="card-body">
              <h6 className="card-title"> For Order : {order.order_id}</h6>
              <h6 className="card-title"> Msg : {order.msgs} </h6>
              <button className='btn btn-secondary'   onClick = {() => {this.handleAppr()}} >
                Approve
              </button>
              <div>Not Eligible for this order right now.</div>
          </div>
          )
        } 
      }))

      } 

   return (
      <div>
         <nav>
          <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
            <Link to="/" className="brand-logo">For Buyer</Link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
            </ul>
          </div>
        </nav>
        <br /><br /><br />
          <br/><br/><br/>
          <div className="card">
          <h6 className="card-header">Messages</h6>
          <div className="card-body">
            {compo}
            </div>
          </div>
         
      </div>
        )
    }
}

export default Buyer;
