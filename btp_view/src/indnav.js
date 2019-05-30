import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class IndNav extends Component {
  render() {
    return (

    <nav>
    <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
      <Link to="/" className="brand-logo">For Individuals</Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to="/indregister">Signup</Link></li>
        <li><Link to="/indlogin">Signin</Link></li>
      </ul>
    </div>
  </nav>
      
    );
  }
}

export default IndNav;