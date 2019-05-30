import React, { Component } from 'react';
import PackageNav from './packagenav';

class Final extends Component {

  handleSubmit = (e) => {

    const email = this.props.match.params.email;

    e.preventDefault();
     fetch('/checkpackage/' + email, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    });
  }
 

  render() {
    return (
      <div>
      <PackageNav />
      <div className='container'>
        <form onSubmit={this.handleSubmit.bind(this)} className='white'>
          <div className='input-field'>
            <button style={{position:'absolute',top:90,left:430}} type="submit" className='btn #009688 lighten-1 z-dpth-0'>Get Access</button>
          </div>
        </form>
      </div>
      </div>

    );
  }
}

export default Final;
