import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PresaleAbi } from "../abi/Presale.json";
import { abi as FairLaunch } from "../abi/FairLaunch.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { error, info } from "./MessagesSlice";
import { ITokenTransferThunk, IJsonRPCError } from "./interfaces";
import { loadAccountDetails } from "./AccountSlice";

export const transferToken = createAsyncThunk(
  "wallet/tranferToken",
  async ({ sendAddress, sendAmount, tokenAddress }: ITokenTransferThunk, { dispatch }) => {

        // "ether":"https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/eth/rinkeby",
    // "bsc":"https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/bsc/testnet",
    // "polygon":"https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/polygon/mumbai"

    let network = localStorage.getItem("network");

    let rpcURL = null;

    if (isTestnet) {
      if (network == 0)
        rpcURL = "https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/eth/rinkeby";
      else if (network == 1)
        rpcURL = "https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/bsc/testnet";
      else if (network == 2)
        rpcURL = "https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/polygon/mumbai";
    } else {
      if (network == 0)
        rpcURL = "https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/eth/mainnet";
      else if (network == 1)
        rpcURL = "https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/bsc/mainnet";
      else if (network == 2)
        rpcURL = "https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/polygon/mainnet";
    }
   
    const privateKey: string = localStorage.getItem("private_key") as string;
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(tokenAddress);
    const erc20Contract = new ethers.Contract(tokenAddress, ierc20Abi, provider.getSigner(wallet.address));
    /*
    function swapEnd(
        bytes32 eventHash,
        uint _depositCount,
        uint fromChainID,
        address from,
        address to,
        uint amount
        ) 
    */
    // let gasLimit = await erc20Contract.estimateGas.swapEnd(eventHash, depositCount, fromChainID, fromAddress, toAddress, amount);
    // let gasPrice = await wallet.getGasPrice();

    // const multiple = BigNumber.from("2");
    // gasLimit = gasLimit.mul(multiple);
    let approveTx;
    try {

        const unsignedTx = await erc20Contract.populateTransaction.transfer(sendAddress, sendAmount);
        approveTx = await wallet.sendTransaction(unsignedTx);
        const text = "Token Transfer";                                                                               
        const pendingTxnType = "token_transfer";
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        await dispatch(loadAccountDetails());
        dispatch(info("Token transferring successed!"));
        
      } catch (e: unknown) {
        dispatch(error((e as IJsonRPCError).message));
        return;
      } finally {
        if (approveTx) {
          dispatch(clearPendingTxn(approveTx.hash));
        }
      }
  },
);
