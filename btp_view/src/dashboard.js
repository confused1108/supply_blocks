import React, { Component } from 'react';
import Nav from './nav';
import Icons from './mainpage';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Icons />
      </div>
         );
  }
}

export default Dashboard;