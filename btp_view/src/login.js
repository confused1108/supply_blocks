import React, { Component } from 'react';
import Nav from './nav';
import {Redirect} from 'react-router-dom';
import Dashbrd from './cdashboard';

class Login extends Component {
  
  constructor(){
    super();
    this.state={
      email:'',
      password:'',
      user :''
    }
  }

  handleChange(e){
    this.setState({[e.target.id]:e.target.value});
  }

  handleSubmit = (e) => {
     const {email , password} = this.state;
    e.preventDefault();

       fetch('/searchuser/' + email + '/' + password)
       .then(res => res.json())
       .then(data => this.setState({user:data}));

  }
  

  render() {
     const user = this.state.user;
     if(user){
        return (
            <Redirect to={{pathname:'/dashbrd' , state:{usr:user}}} />
            );
    }
    else {
    return (
      <div>
     <Nav />
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

export default Login;
