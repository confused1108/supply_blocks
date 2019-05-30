import React, { Component } from 'react';
import Nav from './nav';
import {Redirect} from 'react-router-dom';

class Register extends Component {
  
  constructor(){
    super();
    this.state={
      cname:'',
      website:'',
      email:'',
      password:'',
      number:'',
      success:false
    }
  }

  handleChange(e){
    this.setState({[e.target.id]:e.target.value});
  }

  handleSubmit = (e) => {

     e.preventDefault();
     const {email,website,cname,password,number} = this.state
     fetch('/user/' + cname + '/' + website + '/' + email + '/' + number + '/' + password, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    });
     this.setState({success:true});
  }
 

  render() {
    const email = this.state.email;
    const password = this.state.password;
    if(this.state.success){
        return (
            <Redirect to='/login'/>
            );
    }
    else {
    return (
      <div>
      <Nav />
      <div className='container'>
        <form onSubmit={this.handleSubmit.bind(this)} className='white'>
          <h5 className='grey-text text-darken-3'>Register</h5>
          <div className='input-field'>
            <label htmlFor='cname'>Company Name</label>
            <input type='text' id='cname' name='cname' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='website'>Company Website</label>
            <input type='text' id='website' name='website' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='number'>Contact Number</label>
            <input type='text' id='number' name='number' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <button type="submit" className='btn #009688 lighten-1 z-dpth-0'>Register</button>
          </div>
        </form>
      </div>
      </div>
    );
  }
}}

export default Register;
