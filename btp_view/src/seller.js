import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Web3 from 'web3';
import storehash from './storehash2';
const provider = window.web3.currentProvider ; 
provider.enable(); 
const web3 = new Web3(provider);

class Seller extends Component {

   constructor(){
    super();
    this.state = {
      orders:'',
      signdetails : '',
      order_id:'',
      tx:'',
      forlast:'no'
    }
  }

  componentWillMount(){
    const id =  this.props.match.params.id;
    
     fetch('/seller/' + id)
    .then(res => res.json())
    .then(data => this.setState({orders : data}));
  }
  
   handleClick = (id,id2) => {
    fetch('/generateKeys/' + id + '/' + id2)
      .catch(err => console.log(err));
  }

  handleNext = (id , no) => {

    fetch('/next/' + id + '/' + no)
      .then(res => res.json())
      .then(data => this.setState({forlast:data[0]}));
  }

   contract = async (data) => {

    var oid = this.state.order_id;
    const account = await web3.eth.getAccounts();
    console.log(data);
    var ans = (data.string).toString();
    var cid = Number(data.cid);

    if(data){
    storehash.methods.addSignature(ans, data.idd , cid).send({
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

  signature = (tid , cid , acs) => {
    //var odr_id = this.props.location.state.odr_id;
    var odr_id = this.state.order_id;
    console.log(odr_id)
    fetch('/sign/' + tid + '/' + cid + '/' + odr_id + '/' + this.state.forlast)
      .then(res => res.json())
      .then(data => {
        console.log(data);
         this.setState({signdetails : data });
         this.contract(this.state.signdetails);
      });
    }
  

  render() {

  console.log(this.state.forlast);

  //console.log(this.props.location.state.odr_id);

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
              
              <button className='btn btn-secondary'  
              onClick = {() => this.handleNext(order.order_id,order.transporter_id)}>
                Access Next
              </button>
              <button className='btn btn-secondary' onClick={() => {this.setState({order_id : order.order_id})}} >
                Scan Order_id 
              </button>
              <button className='btn btn-secondary'  
              onClick = {() => this.signature(order.transporter_id,order.noInChain,this.state.forlast)}>
                If Verified Sign
              </button>
            </div>
          </div>
            )
       } else if(order.flag=='false') {
          return (
          <div className="card-body">
              <h6 className="card-title"> For Order : {order.order_id}</h6>
              <h6 className="card-title"> Msg : {order.msgs} </h6>
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
            <Link to="/" className="brand-logo">For Seller</Link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
            </ul>
          </div>
        </nav>
        <br /><br /><br /><br/>
          <div className="card">
          <h6 className="card-header">Messages</h6>
          {compo}
        </div>
    </div>
        )
    }
}

export default Seller;
