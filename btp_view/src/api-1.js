import React, { Component } from 'react';
import Nav from './nav';
import {Redirect} from 'react-router-dom';

class Api1 extends Component {
  
  constructor(){
    super();
    this.state={
      details : ''
    }
  }

  componentWillMount() {

    var id = this.props.match.params.id;
    fetch('/api1/' + id)
    .then(res => res.json())
    .then(data => this.setState({details:data}));
  }

  render() {
     var data = this.state.details;
     if(data){
        return (
            <div>
            <Nav />
            <br /> <br/><br/>
            <ul className="collection">
              <li className="collection-item">Seller Details - {data.s}</li>
              <li className="collection-item">Buyer Details - {data.b} </li>
            </ul>
            <table className="table table-hover">
            <thead>
            <tr>
            <th scope="col">Transporter</th>
            <th scope="col">Signature</th>
            </tr>
            </thead>
            <tbody>
            { data.mainarray.map(trans => {
              return (<tr>
              <th scope="row">{trans.name}</th>
              <td>
              {trans.tx}
          
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
     <p>No info</p>
      </div>
    );
  }
}}

export default Api1;
