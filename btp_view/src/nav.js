import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Nav extends Component {
  render() {
    return (

  <nav>
    <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
      <Link to="/" className="brand-logo">Homepage</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Signin</Link></li>
        <li><Link to="/forind">For Individual</Link></li>
      </ul>
    </div>
  </nav>
      
    );
  }
}

export default Nav;