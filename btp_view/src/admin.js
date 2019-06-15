import React, { Component } from 'react';
import Nav from './nav';
import {Redirect} from 'react-router-dom';

class Admin extends Component {
  
  constructor(){
    super();
    this.state={
     name : '',
     email :'',
     user : ''
    }
  }

  handleChange(e){
    this.setState({[e.target.id]:e.target.value});
  }

  handleSubmit = (e) => {
    const {name , email} = this.state;
    e.preventDefault();

    fetch('/admin/' + name + '/' + email)
   .then(res => res.json())
   .then(data => this.setState({user:data}));

  }
  

  render() {
     const user = this.state.user;
     if(user){
        return (
            <Redirect to='/checkorders' />
            );
    }
    else {
    return (
      <div>
     <Nav />
     <div className="container">
        <form className="white" onSubmit={this.handleSubmit.bind(this)}>
          <h5 className="grey-text text-darken-3">Log In</h5>

          <div className="input-field">
            <label htmlFor="name">Name</label>
            <input type="text" id='name' name="name" onChange={this.handleChange.bind(this)} />
          </div>

          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name="email" onChange={this.handleChange.bind(this)} />
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

export default Admin;
