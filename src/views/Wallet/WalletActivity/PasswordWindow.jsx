
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
import { error } from "../../../slices/MessagesSlice";
import shajs from 'sha.js'

import './PasswordWindow.scss'

export default function ({unLockWallet}) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [inputPassword, setInputPassword] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onUnlock = () => {
    const inputPasswordHash = shajs('sha256').update(inputPassword).digest('hex');
    const savedPasswordHash = localStorage.getItem('password');
    if (inputPasswordHash == savedPasswordHash)
      unLockWallet();
    else
      dispatch(error('Password is wrong!'));
  }

  return <div id="token-send-view">
    <div className="token-symbol">
      <Grid container spacing={2} alignItems="flex-end" fullWidth>
        <Grid item xs={12} sm={12} md={12} lg={12} display="flex" justifyContent="center">
          <div className="input-container">
            <FormControl variant="outlined" color="primary" fullWidth>
              <div style={{ marginBottom: "10px", fontSize: "16px" }}>
                <p>Please input your password</p>
              </div>
              <OutlinedInput
                type="password"
                onChange={e => setInputPassword(e.target.value)}
                value={inputPassword}
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
              className="ok"
              onClick={e => onUnlock()}
            >
              Unlock
            </button>
          </div>
        </Grid>
      </Grid>
    </div>
  </div>
}