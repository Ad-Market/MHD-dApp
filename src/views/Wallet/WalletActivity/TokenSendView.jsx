
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
} from "@material-ui/core";
import { useCallback, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { CircleSpinnerOverlay, DartsSpinnerOverlay, RingSpinnerOverlay, RingSpinner } from 'react-spinner-overlay'
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { transferToken } from "../../../slices/Wallet";

import './TokenSendView.scss'

export default function ({ setWindowId, token }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const getBalance = (balance, decimals) => {
    if (decimals == 18) {
      return Number(ethers.utils.formatEther(balance)).toFixed(2);
    }
    else if (decimals == 9) {
      return Number(ethers.utils.formatUnits(balance, "gwei")).toFixed(2);
    }
  }

  const onSend = async () => {
    let sendAmountBN = null;
    if (token.decimals == 9)
      sendAmountBN = ethers.utils.parseUnits(sendAmount, "gwei");
    else if (token.decimals == 18)
      sendAmountBN = ethers.utils.parseEther(sendAmount);
    setOpen(false);
    setLoading(true);
    await dispatch(transferToken({ sendAddress, sendAmount: sendAmountBN, tokenAddress: token.token_address, network: 1 }));
    setLoading(false);
    setWindowId(0);
  }

  const ConfirmAlertDialog = () => {
    return (
      <div style={{ background: "#ff0 !important" }}>
        <Dialog
          open={open}
          onClose={() => { setOpen(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"

        >
          <div className="dialog">
            <div className="title">Token Send</div>
            <div className="content">
              Do you want to tranfer Token?
            </div>
            <div className="action-button">
              <div style={{ width: "100px" }} />
              <button className="ok" onClick={onSend}>Send</button>
              <button className="cancel" onClick={e => setOpen(false)}>Cancel</button>
            </div>
          </div>

        </Dialog>
      </div>
    );
  };


  const handleOK = () => {
    setOpen(false);
  }

  return <div id="token-send-view">
    <div className="token-symbol">
      <Grid container spacing={2} alignItems="flex-end" fullWidth>
        <Grid item xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="center">
          <div className="logo-container">
            <img className="logo" />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="stake-apy">
            <Typography variant="h3" style={{ color: "#965E96", fontWeight: "bold", textAlign: "center" }}>
              <span style={{ fontSize: '34px' }}>{getBalance(token.balance, token.decimals)}</span>
              <span style={{ fontSize: '34px' }}> {token.symbol}</span>
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="flex-end" fullWidth>
        <Grid item xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="center">
          <div className="input-container">
            <FormControl variant="outlined" color="primary" fullWidth>
              <div>
                <p>Send Amount</p>
              </div>
              <OutlinedInput
                id="slippage"
                multiline="2"
                onChange={e => setSendAmount(e.target.value)}
                value={sendAmount}
              />
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="center">
          <div className="input-container">
            <FormControl variant="outlined" color="primary" fullWidth>
              <div>
                <p>Send Address</p>
              </div>
              <OutlinedInput
                id="slippage"
                multiline="2"
                onChange={e => setSendAddress(e.target.value)}
                value={sendAddress}
              />
            </FormControl>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="flex-end" fullWidth>
        <Grid item xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="center">
          <div className="action-button">
            <button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              className="cancel"
              onClick={e => setWindowId(0)}
            >
              Go Back
            </button>
            <span className="seperator">....</span>
            <button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              className="ok"
              onClick={e => setOpen(true)}
            >
              Send
            </button>
          </div>
        </Grid>
      </Grid>
    </div>
    <ConfirmAlertDialog />
    <RingSpinnerOverlay 
      loading={loading}
      size="100"
      overlayColor="#0006"
      message={<div style={{fontSize: "16px", marginTop: "10px"}}>Token Sending...</div>}
      />
  </div>
}