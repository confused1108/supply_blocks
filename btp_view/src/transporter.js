import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Transporter extends Component {

   constructor(){
    super();
    this.state={
      transporter:''
    }
  }

  componentWillMount(){
    const id = this.props.match.params.id;

     fetch('/transporter/' + id)
    .then(res => res.json())
    .then(data => this.setState({transporter : data}));
  }

  handleClick = (id) => {
    fetch('/generateKeys/' + id)
      .catch(err => console.log(err));
  }

  handleAccess = (id , flag) => {
    fetch('/checkTrans/' + id + '/' + flag);
  }

  render() {
    const data = this.state.transporter;
    console.log(data.orders);
    return (
      <div>
         <nav>
          <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
            <Link to="/" className="brand-logo">For Transporters</Link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
            </ul>
          </div>
        </nav>
        <br /><br /><br />
          <br/><br/><br/>
          <div className="card">
          <h6 className="card-header">Messages</h6>
          {data.orders && data.orders.map(order => {
          return (
          <div className="card-body">
            <h6 className="card-title"> For Order : {order.order_id} </h6>
            <h6 className="card-title"> Msg : {order.msgs} </h6>
            <h6 className="card-title"> Your number in chain : {order.noInChain} </h6>

            <button className='btn btn-secondary'  onClick = {() => this.handleClick(order.order_id)} > Generate Keys </button>
            
            <button  onClick = {() => this.handleAccess(order.order_id , order.flag)} className='btn btn-secondary' >
              Give Access
            </button>

          </div>
          );
        })}
        </div>
  </div>
        )
    }
}

export default Transporter;
