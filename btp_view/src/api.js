import React, { Component } from 'react';
import Nav from './nav';
import {Redirect} from 'react-router-dom';
import { Grid, Row, Col, Table } from "react-bootstrap";

class Api extends Component {
  
  constructor(){
    super();
    this.state={
      order_details:''
    }
  }

  componentWillMount = () => {
    fetch('/api/' + this.props.match.params.id)
    .then(res => res.json())
    .then(data => this.setState({order_details:data}))
  }

  handleVerify = (oid,tid) => {
    fetch('/verifytrans/' + oid + '/' + tid)
    .then(res => res.json())
    .then(data => this.setState({}))
  }

  render() {

    const order_details = this.state.order_details;
     if(order_details.length>0){
        return (
            <div>
            <Nav />
            <div className="card">
            <br/><br/>
            <h4 className="card-header" style={{textAlign:'center'}}>Your Order : {order_details[0].order_id}</h4>
            </div>

            <br /> <br/>
            <table className="table table-hover">
            <thead>
            <tr>
            <th scope="col">Transporters</th>
            <th scope="col">Verify</th>
            <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            { order_details.map(transporter => {
              if(transporter.tx){
                var comp = <p>Complete</p>
              } else{
                var comp = <p>Pending</p>
              }
              return (<tr>
              <th scope="row">ID : {transporter.transporter_id}</th>
              <td>
              <button 
              className='btn btn-secondary' 
              onClick = {() => {this.handleVerify(transporter.order_id,transporter.transporter_id)}} >
                Verify
              </button>
              </td>
              {comp}
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

export default Api;
