import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Check extends Component {

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

  render() {
    const data = this.state.transporter;
    return (
      <div>
         <nav>
          <div className="nav-wrapper" style={{backgroundColor:'#009688'}}>
            <Link to="/" className="brand-logo">For Transporters</Link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
            </ul>
          </div>
        </nav>
        <br /><br /><br /><br/>
          <div className="card">
          <h6 className="card-header">Messages</h6>
          {data.msgs && data.msgs.map(msg => {
          return (
          <div className="card-body">
            <h6 className="card-title">{msg}</h6>
          </div>
          );
        })}
        </div>
  </div>
        )
    }
}

export default Check;
