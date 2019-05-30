import React, { Component } from 'react';
import PackageNav from './packagenav';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';

class Within extends Component {

  constructor(){
    super();
    this.state={
      success:false
    }
  }

  handleClick = (e) => {

  	e.preventDefault();
  	const email = this.props.email;
  	const no = 100;
  	const days = 30;
    const ptype = '1';
    const cid = this.props.match.params.id;
  	const bookdate = new Date();
  	fetch('/addpackage/' + email +'/' + bookdate + '/' + no + '/' + days + '/' + ptype + '/' + cid,{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
  }).then((res) => {
  	this.setState({success:true});
  }).catch((err) => {console.log(err)});
  }

  render() {
  	const email = this.props.email;
     if(this.state.success){
        return (
            <Redirect to={'/checkpackage/' + email} />
            );
    }
    else {
    return (

    	<div>
    	<PackageNav />
    	<div style={{position:'absolute',top:230,left:300}} className="row">
	    <div className="col s12 m3">
	      <div className="card blue-grey darken-1">
	        <div className="card-content white-text">
	          <span className="card-title">Package #1</span>
	          <p>I am a very simple card. I am good at containing small bits of information.
	          I am convenient because I require little markup to use effectively.</p>
	         <p>Price : $x for 30 days - 100</p>
	        </div>
	        <div className="card-action">
	          <button onClick={this.handleClick} className='btn'>Buy</button>
	        </div>
	      </div>
	    </div>
	  
	    <div className="col s12 m3">
	      <div className="card blue-grey darken-1">
	        <div className="card-content white-text">
	          <span className="card-title">Package #2</span>
	          <p>I am a very simple card. I am good at containing small bits of information.
	          I am convenient because I require little markup to use effectively.</p>
	          <p>Price : $y for 20 days</p>
	        </div>
	        <div className="card-action">
	         <button className='btn'>Buy</button>
	        </div>
	      </div>
	    </div>

	  <div className="col s12 m3">
	      <div className="card blue-grey darken-1">
	        <div className="card-content white-text">
	          <span className="card-title">Package #3</span>
	          <p>I am a very simple card. I am good at containing small bits of information.
	          I am convenient because I require little markup to use effectively.</p>
	          <p>Price : $z for 40 days</p>
	        </div>
	        <div className="card-action">
	          <button className='btn'>Buy</button>
	        </div>
	      </div>
	    </div>
	  
      </div>
      </div>
      
    );
  }
}}

export default Within;