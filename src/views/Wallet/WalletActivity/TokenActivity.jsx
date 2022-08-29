import { ArrowLeft, ArrowRight, ArrowBack, ArrowForward, CallMade, CallReceived } from "@material-ui/icons"
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from 'axios';
import {ethers} from 'ethers';

import { shorten } from "../../../helpers";

import './TokenActivity.scss';


export default function TokenActivity({ name, history, address }) {

  // useEffect(async () => {
  //   return getTokenInfo();
  // }, [address])

  const backColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  const isReceived = address.toUpperCase() == history.to.toUpperCase();

  const getBalance = (balance, decimals) => {
    return Number(ethers.utils.formatUnits(balance, decimals));
  }

  const getTransferAmount = () => {
    let transferAmount = getBalance(history.value, history.tokenDecimal) + ' ' + history.tokenSymbol;
    return transferAmount;
  }

  return (
    <div className="token-activity-container">
      <div className="token-symbol">
        {
          isReceived ?
            <CallReceived width="40px" height="40px" style={{ alignSelf: "center" }} /> :
            <CallMade width="40px" height="40px" style={{ alignSelf: "center" }} />
        }
        <div style={{ alignSelf: "center" }}>{name}</div>
        <div className="transaction-info-container">
          <div className="transaction-type">
            {isReceived ? 'Received' : 'Sent'}
          </div>
          <div className="transaction-info">
            {isReceived ? 'From:' + shorten(history.from) : 'To:' + shorten(history.to)}
          </div>
        </div>
      </div>
      <div className="transaction-balance">{getTransferAmount()}</div>
    </div>
  )
}