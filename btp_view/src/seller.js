import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Seller extends Component {

   constructor(){
    super();
    this.state = {
      seller:''
    }
  }

  componentWillMount(){
    const id = this.props.match.params.id;

     fetch('/seller/' + id)
    .then(res => res.json())
    .then(data => this.setState({seller : data}));
  }

  render() {
    const data = this.state.seller;
    return (
      <div>
         <nav>
          <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
            <Link to="/" className="brand-logo">For Transporters</Link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
            </ul>
          </div>
        </nav>
        <br /><br /><br /><br/>
          <div className="card">
          <h6 className="card-header">Messages</h6>
         {data.orders && data.orders.map(order => {
          return (
          <div className="card-body">
            <h6 className="card-title"> For Order : {order.order_id}</h6>
            <h6 className="card-title"> Msg : {order.msgs} </h6>
            <h6 className="card-title"> Your number in chain : {order.noInChain} </h6>
            <Link to={'/tobuyer/' + order.order_id}><button  className='btn btn-secondary' >Processing Start</button></Link>
            <Link to={'/next/' + order.order_id + '/' + this.props.match.params.id}><button  className='btn btn-secondary' >Access Next</button></Link>
          </div>
          );
        })}
        </div>
    </div>
        )
    }
}

export default Seller;
