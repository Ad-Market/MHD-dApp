import { useState, createContext, useContext, useEffect } from "react";

import WalletActivity from './WalletActivity';
import WalletCreate from './WalletCreate';
import { UserContext } from "./../../context";

import WalletBackground from "../../assets/images/wallet/wallet-background.png";

// const UserContext = createContext();

export default function () {
  const [isWalletInfoLoad, setWalletInfo] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [network, setNetwork] = useState(0);
  const [isAppLoad] = useState(false);
  const [savedPassword, setSavedPassword] = useState('');

  useEffect(() => {
    const _privateKey = localStorage.getItem("private_key");
    const _network = localStorage.getItem("network");
    const _savedPassword = localStorage.getItem('password');
    setSavedPassword(_savedPassword);
    if (_network != null) {
      setNetwork(_network);
    }
    else {
      localStorage.setItem("network", network);
    }

    if(_privateKey != null) {
      setPrivateKey(_privateKey);
      setWalletInfo(true);
    }
  }, [isAppLoad])

  const savePrivateKey = _privatekey => {
    setPrivateKey(_privatekey);
    localStorage.setItem("private_key", _privatekey);
    const _savedPassword = localStorage.getItem('password');
    setSavedPassword(_savedPassword);
  }

  console.log(savedPassword, isWalletInfoLoad);
  return (
    <div style={{backgroundImage: 'url("'+WalletBackground+'")', backgroundSize: 'cover', backgroundPosition: 'center', width: "100%", height: "100%"}}>
      {
        !isWalletInfoLoad || savedPassword == undefined ?
          <WalletCreate 
            setWalletInfo={setWalletInfo}
            savePrivateKey={savePrivateKey}
            refreshPassword={setSavedPassword}
            /> :
          <WalletActivity privateKey={privateKey} network={network}/>
      }
    </div>
  )
}