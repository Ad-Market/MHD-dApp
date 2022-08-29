import { useSelector } from "react-redux";
import { Grid, Typography, Select, MenuItem, FormControl, useMediaQuery, makeStyles } from "@material-ui/core";
import "./dashboard.scss";
import React, { useEffect, useState } from "react";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { Container, Row, Col, } from 'react-bootstrap';
import HolderTable from './HolderTable';
import logo from "../../assets/MemeKongLogo.png";
import rainframe from "../../assets/rain-bg.png";
import statsframe from "../../assets/stats-bg.png";
import axios from "axios";


const useStyles = makeStyles(theme => ({

  panel_style: {
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#0e0113cc",
    width: "1000px",
    padding: "30px",
  },

  panel_style_mobile: {
    backgroundColor: "#0e0113cc",
    width: "100%",
    padding: "10px",
  },

}));


function Stats() {
  // Use marketPrice as indicator of loading.
  const [curtoken, setCurtoken] = useState(1);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenVol, setTokenVol] = useState(0);
  const [tokenCap, setTokenCap] = useState(0);
  const [token24H, setToken24H] = useState(0);
  const [token7D, setToken7D] = useState(0);
  const [token30D, setToken30D] = useState(0);
  const classes = useStyles();
  const smallerScreen = useMediaQuery("(max-width: 1300px)");

  const marketPrice = useSelector(state => {
    if (state.app && state.app.marketPrice)
      return state.app.marketPrice;
  });

  const handleTokenChange = (e) => {
    console.log('selector value', e.target.value);
    setCurtoken(e.target.value);
  }

  useEffect(() => {
    getTokenData(curtoken);
  }, [curtoken]);

  const getTokenData = async (id) => {
    try {
      let data = null
      if (curtoken == 1) {
        data = await getDataFromCoingecko('meme-kong');
      } else if (curtoken == 2) {
        data = await getDataFromCoingecko('ethereum');
      } else if (curtoken == 3) {
        data = await getDataFromCoingecko('bitcoin');
      } else if (curtoken == 4) {
        data = await getDataFromCoingecko('binancecoin');
      } else if (curtoken == 5) {
        data = await getDataFromCoingecko('matic-network');
      }
      let price = data.current_price;
      let cap = data.market_cap > 0 ? data.market_cap : (data.current_price * data.total_supply);
      let vol = data.total_volume;
      let h24 = data.price_change_percentage_24h_in_currency;
      let d7 = data.price_change_percentage_7d_in_currency;
      let d30 = data.price_change_percentage_30d_in_currency;

      setTokenPrice(price);
      setTokenVol(vol);
      setTokenCap(cap);
      setToken24H(h24);
      setToken7D(d7);
      setToken30D(d30);
    } catch (e) {
      console.log('[tz]  error in catching token data!!');
    }
  }

  const getDataFromCoingecko = async (id) => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + id + '&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C14d%2C30d';
    const resp = await axios.get(url);
    return resp.data[0];
  }

  return (
    <div>
      <div id="dashboard-view" style={{ backgroundImage: 'url("' + statsframe + '")', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <Grid id="container" direction="column">
          <Grid style={{ marginTop: "100px" }} className={smallerScreen ? classes.panel_style_mobile : classes.panel_style} >
            {(() => {
              if (curtoken == 1) {
                return (
                  <iframe id="tradingview_142d6" name="tradingview_142d6"
                    src="https://dex.guru/token/0xee6b9cf11d968e0bac7bfff547577b8ae35b8065-eth"
                    frameBorder="0" allowTransparency="true"
                    scrolling="no" allowFullScreen="" style={{ display: "block", width: "100%", height: "600px" }} />

                )
              }
              if (curtoken == 2) {
                return (
                  <iframe id="tradingview_142d6" name="tradingview_142d6"
                    src="https://dex.guru/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth"
                    frameBorder="0" allowTransparency="true"
                    scrolling="no" allowFullScreen="" style={{ display: "block", width: "100%", height: "600px" }} />
                )
              }
              if (curtoken == 3) {
                return (
                  <iframe id="tradingview_142d6" name="tradingview_142d6"
                    src="https://dex.guru/token/0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c-bsc"
                    frameBorder="0" allowTransparency="true"
                    scrolling="no" allowFullScreen="" style={{ display: "block", width: "100%", height: "600px" }} />
                )
              }
              if (curtoken == 4) {
                return (
                  <iframe id="tradingview_142d6" name="tradingview_142d6"
                    src="https://dex.guru/token/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc"
                    frameBorder="0" allowTransparency="true"
                    scrolling="no" allowFullScreen="" style={{ display: "block", width: "100%", height: "600px" }} />
                )
              }
              if (curtoken == 5) {
                return (
                  <iframe id="tradingview_142d6" name="tradingview_142d6"
                    src="https://dex.guru/token/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270-polygon"
                    frameBorder="0" allowTransparency="true"
                    scrolling="no" allowFullScreen="" style={{ display: "block", width: "100%", height: "600px" }} />
                )
              }
              return null;
            })()}
          </Grid>
          <Grid style={{ marginTop: "40px", marginBottom: "30px" }} className={smallerScreen ? classes.panel_style_mobile : classes.panel_style} >
            <Row>
              <Col xs lg="3">
                <Typography variant="h4" style={{ display: "flex", alignItems: "center" }}>SELECT TOKEN</Typography>
              </Col>
              <Col xs lg="4">
                <div>
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={curtoken}
                      onChange={handleTokenChange}
                    >
                      <MenuItem value={1}>MKONG</MenuItem>
                      <MenuItem value={2}>ETH</MenuItem>
                      <MenuItem value={3}>BTC</MenuItem>
                      <MenuItem value={4}>BNB</MenuItem>
                      <MenuItem value={5}>MATIC</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Col>
            </Row>
            <div>
              <div>
                <Row>
                  <Col className="stateTokenInfo">
                    Price
                    <Typography variant="h6" className="stateTokenInfoContent">${Number(tokenPrice).toFixed(3)}</Typography>
                  </Col>
                  <Col className="stateTokenInfo">
                    24hr %
                    <Typography variant="h6" className="stateTokenInfoContent">{Number(token24H).toFixed(3)}</Typography>
                  </Col >
                  <Col className="stateTokenInfo">
                    7 day %
                    <Typography variant="h6" className="stateTokenInfoContent">{Number(token7D).toFixed(3)}</Typography>
                  </Col>
                  <Col className="stateTokenInfo">
                    30 day %
                    <Typography variant="h6" className="stateTokenInfoContent">{Number(token30D).toFixed(3)}</Typography>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col className="stateTokenInfo">
                    Market Cap
                    <Typography variant="h6" className="stateTokenInfoContent" style={{ color: "#FF45A5" }}>{
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(tokenCap)
                    }
                    </Typography>
                  </Col>
                  <Col className="stateTokenInfo">
                    Trading Volume (24h)
                    <Typography variant="h6" className="stateTokenInfoContent" style={{ color: "white" }}>{
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(tokenVol)
                    }</Typography>
                  </Col>
                </Row>
              </div>
            </div>
          </Grid>
          <div style={{ marginTop: "10px", marginBottom: "30px" }} className={smallerScreen ? classes.panel_style_mobile : classes.panel_style}>
            <HolderTable />
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Stats;
