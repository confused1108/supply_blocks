import React, { Component } from 'react';
import IndNav from './indnav';

class IndRegister extends Component {
  
  constructor(){
    super();
    this.state={
      number:'',
      email:'',
      password:'',
      firstname:'',
      lastname:''
    }
  }

  handleChange(e){
    this.setState({[e.target.id]:e.target.value});
  }

  handleSubmit = (e) => {

     const {email , password , number , firstname , lastname} = this.state;

    e.preventDefault();
     fetch('/induser/' + firstname + '/' + lastname + '/' + email + '/' + number + '/' + password, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    });
  }
 

  render() {
    return (
      <div>
      <IndNav / >
      <div className='container'>
        <form onSubmit={this.handleSubmit.bind(this)} className='white'>
          <h5 className='grey-text text-darken-3'>Register</h5>
          <div className='input-field'>
            <label htmlFor='firstname'>First Name</label>
            <input type='text' id='firstname' name='firstname' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='lastname'>Last Name</label>
            <input type='text' id='lastname' name='lastname' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='number' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='number'>Contact Number</label>
            <input type='text' id='number' name='number' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' onChange={this.handleChange.bind(this)} />
          </div>
          <div className='input-field'>
            <button type="submit" className='btn #009688 lighten-1 z-dpth-0'>Register</button>
          </div>
        </form>
      </div>
      </div>

    );
  }
}

export default IndRegister;
