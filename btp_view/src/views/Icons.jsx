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
import { Grid, Row, Col, Alert } from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import Card from "components/Card/Card";
import { iconsArray } from "variables/Variables.jsx";

class Icons extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                
                content={
                  <Row>
                   <img src="/images/enterprise-blockchain.png" className="i1"></img>
                   <div className="w3-container w3-content w3-center w3-padding-64">
    <h2 className="w3-wide">ABOUT US</h2>
    <p className="w3-opacity"><i>We love music</i></p>
    <p className="w3-justify">We have created a fictional band website. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur
      adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <div className="w3-row w3-padding-32">
      <div className="w3-third">
        <p>Name</p>
        <img src="/images/enterprise-blockchain.png" className="w3-round w3-margin-bottom" alt="Random Name"></img>
      </div>
      <div className="w3-third">
        <p>Name</p>
        <img src="/images/enterprise-blockchain.png" className="w3-round w3-margin-bottom" alt="Random Name"></img>
      </div>
      <div className="w3-third">
        <p>Name</p>
        <img src="/images/enterprise-blockchain.png" className="w3-round" alt="Random Name"></img>
      </div>
    </div>
  </div>

  <div className="w3-container w3-content w3-center w3-padding-64">
  <h2 className="w3-wide">FIELDS</h2>
  <div className="content">
        <Grid fluid>
  <Row>
            <Col lg={3} sm={6}>
              <StatsCard
              
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
              
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
            
        
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
               
              />
            </Col>
          </Row>
          </Grid>
</div>
  </div>
  <div className="w3-container w3-content w3-center w3-padding-64">
  <h2 className="w3-wide">OUR FEATURES</h2>
  <div className="content">
              <Row>
                <Col md={6}>
                  <h5>Notifications Style</h5>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                </Col>
               
                <Col md={6}>
                  <h5>Notification states</h5>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                </Col>
                </Row>
          <h3 className="f1">Connect with us <a href="h.com">register link</a></h3>

                </div>
  </div>

                  </Row>
                }
              />
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
}

export default Icons;
