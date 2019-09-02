import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {Redirect} from 'react-router-dom';

class QR_Reader extends Component {
  state = {
    result: ''
  }

  handleScan = (data) => {
    if (data) {
      this.setState({
        result: data
      });
    }
  }

  handleError = (err) => {
    console.error(err)
  }
  render() {
    var res = Number(this.state.result);
    var id = this.props.match.params.id;
     if(res){
        return (
            <Redirect to={{pathname:'/seller/' + id , state:{odr_id : res}}} />
            );
    }
    else {
    return (
      <div>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
        />
        <p>{this.state.result}</p>
      </div>
    )
  }}
}

export default QR_Reader;