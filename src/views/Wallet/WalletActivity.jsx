import { useCallback, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@material-ui/core";
import { ethers } from "ethers";
import NewReleases from "@material-ui/icons/NewReleases";
import { BounceLetterLoaderOverlay, LineLoaderOverlay } from 'react-spinner-overlay'

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake, claimReward } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./wallet.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { shorten } from "../../helpers";
import { loadAccountDetails } from "../../slices/AccountSlice";

import ClaimTimer from "../../components/RebaseTimer/ClaimTimer";
import NetworkSelect from "./WalletActivity/NetworkSelect";
import TokenBalance from "./WalletActivity/TokenBalance";
import TokenActivity from "./WalletActivity/TokenActivity";
import TokenSendView from "./WalletActivity/TokenSendView";
import PasswordWindow from "./WalletActivity/PasswordWindow";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

export default function WalletActivity({ privateKey, network }) {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoad] = useState(false);
  const [windowId, setWindowId] = useState(2);
  const [selectedToken, setToken] = useState({});
  const [networkId, setNetworkId] = useState(network);
  const [isNetworkChange, setNetworkChange] = useState(false);
  // const [previousTimeStamp, setPreviousTimeStamp] = useState( Date.now());

  const previousTimeStamp = useRef(Date.now());
  const [tooltipText, setTooltipText] = useState('Copy to Clipboard');

  const stakedBalance = useSelector(state => {
    return state.account.staking && state.account.staking.stakedBalance;
  });

  const nativeBalance = useSelector(state => {
    return state.account.balances && state.account.balances.nativeBalance;
  });

  const tokenBalances = useSelector(state => {
    return state.account.balances && state.account.balances.tokenBalances;
  });

  const tokenHistory = useSelector(state => {
    return state.account.balances && state.account.balances.tokenHistory;
  });

  console.log('tokenHistory', tokenHistory);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  )

  let timerId = 0;
  useEffect(() => {
    const Wallet = ethers.Wallet;
    try {
      const wallet = new Wallet(privateKey);
      setWalletAddress(wallet.address);
    } catch (e) {
      console.log(e);
    }

    timerId = setInterval(lockTimeoutHandler, 1000);
  }, [isLoad]);

  const lockTimeoutHandler = () => {
    const currentTime = Date.now();
    console.log("previousTimeStamp", previousTimeStamp.current);
    console.log("currentTime", currentTime);
    console.log("delta", currentTime - previousTimeStamp.current);
    if (currentTime - previousTimeStamp.current > 10000)
    {
      clearInterval(timerId);
      setWindowId(2);
    }
    // setTimeout(lockTimeoutHandler, 1000);
  }

  const unLockWallet = () => {
    setWindowId(0);
    // setPreviousTimeStamp(Date.now())
    previousTimeStamp.current = Date.now();
    timerId = setInterval(lockTimeoutHandler, 1000);
  }

  const tokenSend = (token) => {
    setToken(token);
    setWindowId(1);
  }

  const onChangeNetwork = async (value) => {
    setNetworkId(value);
    setNetworkChange(true);
    localStorage.setItem("network", value);
    await dispatch(loadAccountDetails());
    setNetworkChange(false);
  }

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      console.log('Text or Page URL copied');
      setTooltipText("Copied");
      setTimeout(() => setTooltipText("Copy to Clipboard"), 3000);
    }
    catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const changeView = (event, newView) => {
    setView(newView);
  }

  const trimmedBalance = Number(
    [stakedBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  const TokenActivityListView = () => {
    const NativeCurrencySymbols = ["ETH", "BNB", "MATIC"];

    return (
      <>
        <Grid item>
          <div className="stake-top-metrics">
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className="stake-apy">
                  <Typography variant="h3" style={{ color: "#965E96", fontWeight: "bold" }}>
                    {nativeBalance == undefined ? 0 : Number.parseFloat(nativeBalance).toFixed(4) + " " + NativeCurrencySymbols[networkId]}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <div className="staking-area">
          <Box className="stake-action-area">
            <Tabs
              key={String(zoomed)}
              centered
              value={view}
              textColor="primary"
              indicatorColor="primary"
              className="stake-tab-buttons"
              onChange={changeView}
              aria-label="stake tabs"
            >
              <Tab label="Assets" {...a11yProps(0)} style={{ width: "150px" }} />
              <Tab label="Activity" {...a11yProps(1)} style={{ width: "150px" }} />
            </Tabs>
            <Box className="stake-action-row " display="flex" alignItems="center">
              <TabPanel value={view} index={0} className="wallet-tab-panel">
                <div className="tab-body-container">
                  {
                    tokenBalances && tokenBalances.map((item, index) => {
                      return <TokenBalance key={index} token={item} name={item.symbol} balance={item.balance} decimals={item.decimals} tokenSend={tokenSend} />
                    })
                  }
                </div>
              </TabPanel>
              <TabPanel value={view} index={1} className="wallet-tab-panel">
                <div className="tab-body-container">
                  {
                    tokenHistory && tokenHistory.map((item, index) => {
                      return <TokenActivity key={index} history={item} address={walletAddress} />
                    })
                  }
                </div>
              </TabPanel>
              <TabPanel value={view} index={2} className="wallet-tab-panel">
              </TabPanel>
            </Box>
          </Box>
        </div>
      </>
    )
  }

  // const setWindowId = (id) => {

  // }

  let windowArray = [];
  windowArray.push(<TokenActivityListView setWindowId={setWindowId} />);
  windowArray.push(<TokenSendView setWindowId={setWindowId} token={selectedToken} />);
  windowArray.push(<PasswordWindow unLockWallet={unLockWallet}/>);

  const onMouseMoveHandler = e => {
    // setPreviousTimeStamp(Date.now());
    previousTimeStamp.current = Date.now();
  }

  return (
    <div id="stake-view" onMouseMove={onMouseMoveHandler}>
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`} style={{ borderRadius: "10px", background: "rgba(14, 1, 19, 0.8)", boxShadow: "0px 6px 6px rgba(255, 255, 255, 0.2)" }}>
          <Grid container direction="column" spacing={2}>
            <div className="card-header">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={4} style={{ alignItems: "center", display: "flex", justifyContent: "center" }}>
                  <Typography variant="h3">MKONG Wallet </Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={4} style={{ alignItems: "center", display: "flex" }}>
                  <Tooltip title={tooltipText}>
                    <Typography variant="h5" style={{ color: "#fa0", cursor: "pointer" }} onClick={copyWalletAddress}>{shorten(walletAddress)}</Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={3} sm={3} md={4} lg={1} />
                <Grid item xs={4} sm={4} md={3} lg={3}>
                  <NetworkSelect onChange={onChangeNetwork} value={networkId} />
                </Grid>
              </Grid>
            </div>
            {windowArray[windowId]}
          </Grid>
        </Paper>
      </Zoom>
      <BounceLetterLoaderOverlay
        loading={isNetworkChange}
        letters="Network Switching..."
        animationDuration={3}
        color="#fff"
        overlayColor="#000a"
        style={{ fontSize: "36px" }}
      />
      <LineLoaderOverlay
        loading={nativeBalance == undefined}
        overlayColor="#000a"
        color="#fff"
        width={280}
        animationDuration={3}
        message={<div style={{ fontSize: "16px", marginTop: "10px" }}>Account Info Loading...</div>}
      />
    </div>
  );
}
