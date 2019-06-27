import React, { Component } from 'react';

class Next extends Component {

  componentWillMount(){
    const id = this.props.match.params.id;
    const no = this.props.match.params.no;
     fetch('/next/' + id + '/' + no)
    .then(res => res.json())
  }

  render() {

    return (
      <div>
      Move to Signatures
      </div>
        )
    }
}

export default Next;
