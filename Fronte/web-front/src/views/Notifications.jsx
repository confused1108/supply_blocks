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

import Button from "components/CustomButton/CustomButton.jsx";

class Notifications extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <div className="card">
            <div className="header">
              <h4 className="title">Messages</h4>
            </div>
            <div className="content">
              <Row>
                <Col md={6}>
                  <h5>Notifications Style</h5>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                  
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                </Col>
                <Col md={6}>
                  <h5>Notification states</h5>
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                  <Alert bsStyle="info">
                    <span>This is a plain notification</span>
                  </Alert>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button className="att">verify</button>
                  <button>verify</button>
                
                </Col>
              </Row>
              <br />
              <br />
              <div className="places-buttons">
                <Row>
                  <Col md={6} mdOffset={3} className="text-center">
                    <h5>
                      Notifications Places
                      <p className="category">Click to view notifications</p>
                    </h5>
                  </Col>
                </Row>
                <Row>
                  <Col md={2} mdOffset={3}>
                    <Button
                      bsStyle="default"
                      block
                      onClick={() => this.props.handleClick("tl")}
                    >
                      Top Left
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      bsStyle="default"
                      block
                      onClick={() => this.props.handleClick("tc")}
                    >
                      Top Center
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      bsStyle="default"
                      block
                      onClick={() => this.props.handleClick("tr")}
                    >
                      Top Right
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={2} mdOffset={3}>
                    <Button
                      bsStyle="default"
                      block
                      onClick={() => this.props.handleClick("bl")}
                    >
                      Bottom Left
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      bsStyle="default"
                      block
                      onClick={() => this.props.handleClick("bc")}
                    >
                      Bottom Center
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      bsStyle="default"
                      block
                      onClick={() => this.props.handleClick("br")}
                    >
                      Bottom Right
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default Notifications;
