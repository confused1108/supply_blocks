/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";

class TableList extends Component {
  state={
    // city,verified,check,timestamp 
    ar:[
      {key:"1",city:"gwalior",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"2",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"3",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"4",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"5",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"6",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"7",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"8",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"9",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"},
      {key:"10",city:"gwali",approval:"approved",check:"yes",timestamp:"16:00:80"}
      ],
    c:0
  }
  tap=()=>{
    let cs=!this.state.c;
    this.setState({
      c:cs
    })
  }
  popup=()=>{
    alert("asddas")
  }
  render() {
    return (
      <div className="content">
      
        <Grid fluid>
        <div className="container">
    <input type="text" maxlength= "12"             placeholder="Order Id" className="searchbar"></input>
  <img src="https://images-na.ssl-images-amazon.com/images/I/41gYkruZM2L.png" alt="Magnifying Glass" className="button" onClick={this.tap}></img>
  </div>
          <Row> 
            <Col md={12}>
              <Card
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>City</th>
                        <th>Approved</th>
                        <th>Checklist</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                 { this.state.c?
                    <tbody>
                      {this.state.ar.map(arr => {
                        return (
                          <tr>
                            <td>{arr.key}.</td>
                            <td>{arr.city}</td>
                            <td>{arr.approval}</td>
                            <td><a href="#" className="myButton" onClick={this.popup}>blue</a></td>
                            <td>{arr.timestamp}</td>
                          </tr>
                        );
                      })}
                    </tbody>:null
                 }
                   
                    
                  </Table>
                }
              />
            </Col>

             </Row>
        </Grid>
      </div>
    );
  }
}

export default TableList;
