import React, { Component } from 'react';
import IndNav from './indnav';
import {Redirect} from 'react-router';

class IndLogin extends Component {
  
  constructor(){
    super();
    this.state={
      email:'',
      password:'',
      sucess:false
    }
  }

  handleChange(e){
    this.setState({[e.target.id]:e.target.value});
  }

  handleSubmit = (e) => {

    const {email , password} = this.state;

    e.preventDefault();
    fetch('/searchinduser/' + email + '/' + password, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    }).then((user) => {
      this.setState({success : true});
    }).catch((err) => {
      console.log(err);
    });
  }
  

  render() {
     const email = this.state.email;
     if(this.state.success){
        return (
            <Redirect to='/packages' />
            );
    }
    else {
    return (
     <div>
     <IndNav / >
     <div className="container">
        <form className="white" onSubmit={this.handleSubmit.bind(this)}>
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name="email" onChange={this.handleChange.bind(this)} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name="password" onChange={this.handleChange.bind(this)} />
          </div>
          <div className="input-field">
            <button type="submit" className="btn #009688 lighten-1 z-depth-0">Login</button>
          </div>
        </form>
      </div>
      </div>
    );
  }
}}

export default IndLogin;
