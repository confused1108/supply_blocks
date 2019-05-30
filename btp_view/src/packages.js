import React, { Component } from 'react';


class Packages extends Component {

  handleClick = (id) => {
  	fetch('/package/' + id)
  	.then(res => res.json)
  	.catch(err => console.log(err));
  }

  render() {
	const data = this.props.location.state.pck;
	return (

  <div>
  <PackageNav cid={data[0].cid} />
  {data && data.map(pck => {
	return (
  	  <div className="row">
	    <div className="col s12 m4">
	      <div className="card blue-grey darken-1">
	        <div className="card-content white-text">
	          <span className="card-title">Package Type : {pck.packagetype}</span>
	          <p>Bookdate : {pck.bookdate}</p>
	          <p>Can use for : {pck.total} from Bookdate</p>
	          <p>Total left to use : {pck.no}</p>
	        </div>
	        <div className="card-action">
	          <Link to={'/package/' + pck._id}>Use</Link>
	        </div>
	      </div>
	    </div></div>
  	);})} 
  
  </div>  
    );
  }
}

export default Packages;