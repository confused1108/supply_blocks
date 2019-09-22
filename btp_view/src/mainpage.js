import React, { Component } from "react";
import { Grid, Row, Col, Alert } from "react-bootstrap";
import { StatsCard } from "./components/StatsCard/StatsCard.jsx";
import Card from "./components/Card/Card";
import { iconsArray } from "./variables/Variables.jsx";
import img1 from "./imgg.jpg";
import img2 from "./sidebar-2.jpg";
import img3 from "./sidebar-3.jpg";
import img4 from "./sidebar-4.jpg";

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
                   <img src={img1} className="i1" style={{position:'absolute',top:-34,left:0,width:1370,height:600}}></img>
                  <div>
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
