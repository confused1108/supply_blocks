import React, { Component } from 'react';
import NextCompo from './nextcompo';

class Hash extends Component {

    constructor(){
      super()
      this.state = {
        ethAddress:'',
        transactionHash:'',
        hash:''
      }
    }
    
    componentWillMount(){

      const id = this.props.match.params.id;

      fetch('/gethash/' + id)
      .then(res => res.json())
      .then(data => this.setState({hash : data.convertedHash}));
    }
  
    render() {

      return (
        <div>
            <p>Hash = {this.state.hash}</p>
            <NextCompo hash = {this.state.hash} />
        </div>
      );
    }
}

export default Hash;
