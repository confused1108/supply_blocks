import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';

class Dashbrd extends Component {


  render() {
    return (
      <div className = 'Dashbrd'>
       <nav>
        <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
          <Link to="#" className="brand-logo">Dashboard</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to="#">{this.props.location.state.usr.cname}</Link></li>
            <li><a href="#">Account Details</a></li>
          </ul>
        </div>
      </nav>
      <Link to={'/check/' + this.props.location.state.usr._id}>ACCESS</Link>
      </div>
    );
  
}}

export default Dashbrd;
