import React, { Component } from 'react';

class Add extends Component {

  componentWillMount(){
    const id = this.props.match.params.id;
    fetch('/package/' + id)
    .then(res => res.json())
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
      Hey
      </div>

    );
  }
}

export default Add;
