import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Paper, Tab, Tabs, Box, Grid, FormControl, OutlinedInput, InputAdornment } from "@material-ui/core";
import InfoTooltipMulti from "../../components/InfoTooltip/InfoTooltipMulti";

import TabPanel from "../../components/TabPanel";
import CardHeader from "../../components/CardHeader/CardHeader";
import "./presale.scss";
import { addresses, POOL_GRAPH_URLS } from "../../constants";
import { useWeb3Context } from "../../hooks";
import { apolloExt } from "../../lib/apolloClient";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { calculateOdds } from "../../helpers/33Together";
import { getPoolValues, getRNGStatus } from "../../slices/PoolThunk";
import { trim } from "../../helpers/index";
import { Typography, Button, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { error, info } from "../../slices/MessagesSlice";
import { PresaleCard } from "./PresaleCard";
import { FairLaunchCard } from "./FairLaunchCard";

function a11yProps(index) {
  return {
    id: `pool-tab-${index}`,
    "aria-controls": `pool-tabpanel-${index}`,
  };
}

const MAX_DAI_AMOUNT = 100;

const Swap = () => {
  const [view, setView] = useState(0);

  const changeView = (event, newView) => {
    setView(newView);
  };

  // NOTE (appleseed): these calcs were previously in PoolInfo, however would be need in PoolPrize, too, if...
  // ... we ever were to implement other types of awards
  const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();
  const dispatch = useDispatch();
  let history = useHistory();
  const [graphUrl, setGraphUrl] = useState(POOL_GRAPH_URLS[chainID]);
  const [poolData, setPoolData] = useState(null);
  const [poolDataError, setPoolDataError] = useState(null);
  const [graphLoading, setGraphLoading] = useState(true);
  const [walletChecked, setWalletChecked] = useState(false);
  const [winners, setWinners] = useState("--");
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalSponsorship, setTotalSponsorship] = useState(0);
  const [yourOdds, setYourOdds] = useState(0);
  const [yourTotalAwards, setYourTotalAwards] = useState(0);
  const [cstpBalance, setCSTPBalance] = useState(0);
  const [inputBUSDAmount, setBUSDBalance] = useState(0);

  // TODO (appleseed-33T): create a table for AwardHistory
  const [yourAwardHistory, setYourAwardHistory] = useState([]);
  const [infoTooltipMessage, setInfoTooltipMessage] = useState([
    "Deposit sPID to win! Once deposited, you will receive a corresponding amount of 3,3 π and be entered to win until your sPID is withdrawn.",
  ]);
  const isAccountLoading = useSelector(state => state.account.loading ?? true);

  const daiBalance = useSelector(state => {
    return state.account.balances && state.account.balances.dai;
  });

  const daiFaiLaunchAllownace = useSelector(state => {
    return state.account.presale && state.account.presale.daiFaiLaunchAllownace;
  });

  const cstInCirculation = useSelector(state => {
    return state.account.balances && state.account.balances.cstInCirculation;
  });

  const cstpTotalSupply = useSelector(state => {
    return state.account.balances && state.account.balances.cstpTotalSupply;
  });

  const poolBalance = useSelector(state => {
    return state.account.balances && state.account.balances.pool;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const cstPurchaseBalance = useSelector(state => {
    return state.account.presale && state.account.presale.cstPurchaseBalance;
  }) | 0;

  const isFairLunchFinshed = useSelector(state => {
    return state.account.presale && state.account.presale.isFairLunchFinshed;
  });

  const pendingPayoutPresale = useSelector(state => {
    return state.account.presale && state.account.presale.pendingPayoutPresale;
  });

  const vestingPeriodPresale = useSelector(state => {
    return state.account.presale && state.account.presale.vestingPeriodPresale;
  });

  const cstpPrice = 5;

  const setCSTPBalanceCallback = (value) => {
    if ((value * cstpPrice) > MAX_DAI_AMOUNT && (value * cstpPrice) > (MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice)) {
      setBUSDBalance(MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice);
      setCSTPBalance((MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice) / cstpPrice);
    }
    else {
      setCSTPBalance(value);
      setBUSDBalance(value * cstpPrice);
    }
  }

  const setBUSDBalanceCallback = (value) => {
    if (value > MAX_DAI_AMOUNT && value > (MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice)) {
      setBUSDBalance(MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice);
      setCSTPBalance((MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice) / cstpPrice);
    }
    else {
      setBUSDBalance(value);
      setCSTPBalance(value / cstpPrice);
    }
  }


  const setMax = () => {
    if (daiBalance > MAX_DAI_AMOUNT && daiBalance > (MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice))
      setBUSDBalanceCallback(MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice);
    else
      setBUSDBalanceCallback(daiBalance);
  };


  const hasAllowance = useCallback(
    () => {
      return daiFaiLaunchAllownace > 0;
      return 0;
    },
    [daiFaiLaunchAllownace],
  )

  const onPurchaseCST = async action => {
    // eslint-disable-next-line no-restricted-globals
  
  };

  console.log('MAX_DAI_AMOUNT - cstPurchaseBalance * cstpPrice', cstPurchaseBalance);

  const onClaim = async action => {
    // eslint-disable-next-line no-restricted-globals
    // await dispatch(redeem({ provider, address, networkID: chainID }));
  };


  const onSeekApproval = async token => {
    // await dispatch(changeApproval({ address, provider, networkID: chainID }));
  };

  // query correct pool subgraph depending on current chain
  useEffect(() => {
    setGraphUrl(POOL_GRAPH_URLS[chainID]);
  }, [chainID]);

  useEffect(() => {
    let userOdds = calculateOdds(poolBalance, totalDeposits, winners);
    setYourOdds(userOdds);
  }, [winners, totalDeposits, poolBalance]);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      dispatch(getPoolValues({ networkID: chainID, provider: provider }));
      dispatch(getRNGStatus({ networkID: chainID, provider: provider }));
    }
  }, [walletChecked]);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Swap
    </Button>,
  )

  modalButton.push(
    <Button
      className="stake-button"
      variant="contained"
      color="primary"
      disabled={isPendingTxn(pendingTransactions, "buy_presale")}
      onClick={() => {
        onPurchaseCST();
      }}
    >
      {txnButtonText(pendingTransactions, "buy_presale", "Buy")}
    </Button>
  )

  modalButton.push(
    <Button
      className="stake-button"
      variant="contained"
      color="primary"
      disabled={isPendingTxn(pendingTransactions, "approve_presale")}
      onClick={() => {
        onSeekApproval();
      }}
    >
      {txnButtonText(pendingTransactions, "approve_presale", "Approve")}
    </Button>
  )


  let claimButton = [];

  claimButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  )

  claimButton.push(
    <Button
      className="stake-button"
      variant="contained"
      color="primary"
      disabled={isPendingTxn(pendingTransactions, "redeem_presale")}
      onClick={() => {
        onClaim();
      }}
    >
      {txnButtonText(pendingTransactions, "redeem_presale", "Claim")}
    </Button>
  )


  claimButton.push(
    <Button
      className="stake-button"
      variant="contained"
      color="primary"
      disabled={true}
      onClick={() => {
        onClaim();
      }}
    >
      {/*txnButtonText(pendingTransactions, "redeem_presale", "Claim and Stake")*/ "Claim and Stake"}
    </Button>
  )

  return (
    <Zoom in={true}>
      <div id="pool-together-view">
        {
          !isFairLunchFinshed ?
            <PresaleCard
              address={address}
              cstPurchaseBalance={cstPurchaseBalance}
              cstpPrice={cstpPrice}
              cstpTotalSupply={cstpTotalSupply}
              cstInCirculation={cstInCirculation}
              cstpBalance={cstpBalance}
              inputBUSDAmount={inputBUSDAmount}
              modalButton={modalButton}
              setMax={setMax}
              hasAllowance={hasAllowance}
              setCSTPBalanceCallback={setCSTPBalanceCallback}
              setBUSDBalanceCallback={setBUSDBalanceCallback}
            /> :
            <FairLaunchCard
              address={address}
              cstPurchaseBalance={cstPurchaseBalance}
              pendingPayoutPresale={pendingPayoutPresale}
              vestingPeriodPresale={vestingPeriodPresale}
              claimButton={claimButton}
            />
        }
      </div >
    </Zoom>
  );
};

export default Swap;

















/* import { useDispatch,useSelector } from "react-redux";
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

  return <div id="home_tarzan" className={classes.bg_image}> */

    {/* <div className="boodyBox fxColumn">
      <img src={Bg} alt="" className="bg" />
    </div> */}
    
    
    /*
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
              My Happy Doge
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
                You deserve more. MHD Token unites community and utility in the first hybrid token.
              </Typography>
            </Grid>
          </Grid>
        </Col>
        <Col style={{display:"flex", justifyContent:"center"}}>
          <img src={homeframe} withd="100%" height="300px" />
        </Col>
      </Row>
      
      <div style={{marginTop: "50px"}}>
        <iframe loading="lazy" src="https://swap.mhd.community" style={{border:"0px", margin:"0px auto", display:"block", borderRadius:"20px", maxWidth:"600px"}}
        id="myId" width="100%" height="600px">
        </iframe>
      </div>

    </Container>
  </div>
}

export default Home;*/
