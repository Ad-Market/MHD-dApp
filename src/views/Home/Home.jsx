import { useDispatch,useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom,Button, SvgIcon, useMediaQuery, Container, makeStyles } from "@material-ui/core";
import {useEffect,useCallback, useMemo} from 'react'
import { useWeb3Context } from "src/hooks/web3Context";
import "./home.scss";

import Bg from '../../assets/ohm/bg.png'
import { Link } from "react-router-dom";

import CaiDan from '../../assets/ohm/tuozhuaicaidandaohang.png'
import { useState } from "react";
import medium from '../../assets/ohm/med@2x.png';
import { FixedFormat } from "@ethersproject/bignumber";
import styled from "styled-components";
import PdImg from '../../assets/ohm/pd.png'
import WuImg from '../../assets/ohm/wu.png'
import DiscordImg from '../../assets/dis.png'
import GuanImg from '../../assets/ohm/copy-2-3@3x.png'
import { shorten } from "../../helpers";
import gorila from "../../assets/gorila.svg";
import homebg from "../../assets/home_bg.png";
import statsframe from "../../assets/stats-bg.png";
import homeframe from "../../assets/home_frame.png";
import { Card, Table, Badge, Dropdown, ProgressBar, Row, Col } from "react-bootstrap";

const useStyles = makeStyles(theme => ({

    lgorilla_style: {
      position: "fixed",
      bottom: "0px",
      left:"10%",
      width: "200px",
      height: "200px",
    },

    lgorilla_style_mobile: {
      position: "fixed",
      bottom: "0px",
      left:"0%",
      width: "100px",
      height: "100px",
      visibility: "hidden",
    },

    rgorilla_style: {
      position: "fixed",
      bottom: "0px",
      right:"10%",
      width: "200px",
      height: "200px",
      transform: "scaleX(-1)"
    }, 

    rgorilla_style_mobile: {
      position: "fixed",
      bottom: "0px",
      right:"0%",
      width: "100px",
      height: "100px",
      transform: "scaleX(-1)",
      visibility: "hidden",
    }, 

    bg_image: {
      padding: '10px', 
      backgroundImage: 'url("'+statsframe+'")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    },

}));


function Home() {
  const { provider, address, connected, connect, chainID,disconnect } = useWeb3Context();
  const [menu, setmenu] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isConnected, setConnected] = useState(connected);
  const [anchorEl, setAnchorEl] = useState(null);
  const [delayShow,setDelayShow] = useState(false)
  const smallerScreen = useMediaQuery("(max-width: 1100px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const classes = useStyles();

  return <div id="home_tarzan" className={classes.bg_image}>
    {/* <div className="boodyBox fxColumn">
      <img src={Bg} alt="" className="bg" />
    </div> */}
    <img src={gorila} className={smallerScreen? classes.lgorilla_style_mobile : classes.lgorilla_style}/>
    <img src={gorila} className={smallerScreen? classes.rgorilla_style_mobile : classes.rgorilla_style}/>
    <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "0.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "0.3rem",
        }}
      >
      <Row>
        <Col>
          <div style={{display:"flex", justifyContent:"left", marginTop: "40px", marginBottom:"30px"}}>
            <Typography style={{color: "#FF45A5", fontSize:"60px", lineHeight:"1.1", fontWeight:"600"}}>
              MEME KONG
            </Typography>
          </div>
          <div style={{display:"flex", justifyContent:"left", marginTop: "20px", marginBottom: "30px", fontFamily: "Roboto"}}>
            <Typography variant="h3">
              The King of All Meme Coins
            </Typography>
          </div>
          <Grid container spacing={3} className="data-grid">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="h3" style={{fontSize:"20px", fontWeight:"300"}}>
                You deserve more. Meme Kong unites community and utility in the first hybrid token.
              </Typography>
            </Grid>
          </Grid>
        </Col>
        <Col style={{display:"flex", justifyContent:"center"}}>
          <img src={homeframe} withd="100%" height="300px" />
        </Col>
      </Row>
      
      <div style={{marginTop: "50px"}}>
        
      </div>


      <div style={{marginTop: "50px", display:"flex", width:"100%"}}><iframe loading="lazy" src="https://teams.bogged.finance/embeds/chart?address=0x29db8abd21f2ffdf5da9b2e4bbdd70f8b47b15f2" style={{border:"0px", margin:"0px auto", display:"block", borderRadius:"20px", maxWidth:"600px"}}
        id="myId" width="100%" height="600px">
        </iframe>
      </div>

    </Container>
  </div>
}

export default Home;
