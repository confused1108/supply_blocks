import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class PackageNav extends Component {
  render() {
    const cid = this.props.cid;
    return (

    <nav>
    <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
      <Link to="/" className="brand-logo">For Packages</Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to={'/within/' + cid }>Within City</Link></li>
        <li><Link to="/national">National</Link></li>
        <li><Link to="/international">International</Link></li>
      </ul>
    </div>
  </nav>
      
    );
  }
}

export default PackageNav;