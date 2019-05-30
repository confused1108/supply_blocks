import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import PackageNav from './packagenav';

class Check extends Component {

   constructor(){
    super();
    this.state={
      packagedata:''
    }
  }

  componentWillMount(){
    const id = this.props.match.params.id;

     fetch('/check/' + id)
    .then(res => res.json())
    .then(data => this.setState({packagedata : data}));
  }

  render() {
    const data = this.state.packagedata;
    return (

      <div>
      <PackageNav cid={this.props.match.params.id} />
      {data && data.map(pck => {
      return (
          <div className="row">
          <div className="col s12 m4">
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">Package Type : {pck.packagetype}</span>
                <p>Bookdate : {pck.bookdate}</p>
                <p>Can use for : {pck.total} from Bookdate</p>
                <p>Total left to use : {pck.no}</p>
              </div>
              <div className="card-action">
                <Link to={'/package/' + pck._id}>Use</Link>
              </div>
            </div>
          </div></div>
        );})} 
  
  </div> 
  ); 
  }
}

export default Check;
