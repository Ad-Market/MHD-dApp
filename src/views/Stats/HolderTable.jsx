import { useDispatch, useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { BounceLetterLoaderOverlay, LineLoaderOverlay } from 'react-spinner-overlay'
import { useWeb3Context } from "src/hooks/web3Context";
import { abi as ierc20Abi } from "../../abi/IERC20.json";
import { BigNumber, ethers } from "ethers";
import "./holdertable.scss";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Container, Row, Col, Table } from 'react-bootstrap';
import logo from "../../assets/MemeKongLogo.png";
import { Button, TextField } from "@material-ui/core";
import ReactPaginate from "react-paginate";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { error } from "../../slices/MessagesSlice";

const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/20cea78632b2835b730fdcf4/eth/mainnet");
const tokenContract = new ethers.Contract("0xeE6b9CF11D968E0bAc7BFfF547577B8AE35B8065", ierc20Abi, provider);

const useStyles = makeStyles(theme => ({
  addAddressBtn: {
    marginLeft: "10px",
    background: "#D4088C",
    '&:hover': {
      backgroundColor: '#d4088c9c',
    }
  },
}));

const PER_PAGE = 10;

function HolderTable() {
  // Use marketPrice as indicator of loading.
  // const { provider, connect } = useWeb3Context();
  const [addCount, setAddCount] = useState(0);
  const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
  const [newAddress, setNewAddress] = useState("");

  const [holderData, setHolderData] = useState([]);
  const [walletList, setWalletList] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const classes = useStyles();
  const [tokenPrice, setTokenPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [overlayText, setOverlayText] = useState('Wallet Info Loading...');
  const [totalMkongAmount, setTotalMkongAmount] = useState(0);

  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const dispatch = useDispatch();

  useEffect(() => {
    loadData(1);
    loadMarketPrice();
  }, []);

  const loadData = async (curPage) => {
    setLoading(true);
    const walleListString = localStorage.getItem('wallet-list');
    let tempList = JSON.parse(walleListString);

    let _totalMkongAmount = 0;
    if (tempList) {
      const info = holderData;

      for (let i = 0; i < tempList.length; i++) {
        const address = tempList[i];
        let mkongBalance = await tokenContract.balanceOf(address);
        let mkongAmount = ethers.utils.formatUnits(mkongBalance, "gwei");
        _totalMkongAmount += +mkongAmount;
        const newHolder = { address: address, amount: mkongAmount };
        info.push(newHolder);
        setHolderData(info);
      }
      const currentPageData = info.slice(0, PER_PAGE);
      setPageData(currentPageData);
    } else {
      tempList = [];
    }

    setTotalMkongAmount(_totalMkongAmount);
    setWalletList(tempList);
    setLoading(false);
  }

  const loadMarketPrice = async () => {
    try {
      const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=meme-kong&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C14d%2C30d", {
        headers: { "X-API-Key": "YEEwMh0B4VRg6Hu5gFQcKxqinJ7UizRza1JpbkyMgNTfj4jUkSaZVajOxLNabvnt" },
      });

      let price = res.data[0].current_price;
      setTokenPrice(price);
    } catch (e) {
      console.log(e);
    }
  };

  const addNewAddress = async () => {

    if (walletList && walletList.length > 0) {
      let isExist = walletList.find(address => address.toUpperCase() == newAddress.toUpperCase());
      if (isExist) {
        dispatch(error("This address alread exist"));
        return;
      }
    }

    setLoading(true);
    setOverlayText('Adding new address');

    let mkongAmount = 0;
    try {
      let mkongBalance = await tokenContract.balanceOf(newAddress);
      mkongAmount = ethers.utils.formatUnits(mkongBalance, "gwei");
    } catch (e) {
      dispatch(error("incorrect address"));
      setLoading(false);
      return;
    }

    const newHolder = { address: newAddress, amount: mkongAmount };
    let userData = {
      address: newHolder.address,
      amount: newHolder.amount,
    };
    const info = holderData;
    info.push(userData);

    setHolderData(info);

    // loadData(1);

    let tempList = walletList;
    tempList.push(newAddress);
    setWalletList(tempList);
    localStorage.setItem('wallet-list', JSON.stringify(tempList));

    handlePageClick({ selected: currentPage });
    setLoading(false);
  };

  const setAddressInputCallBack = (value) => {
    setNewAddress(value);
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
    const offset = selectedPage * PER_PAGE;
    const currentPageData = holderData.slice(offset, offset + PER_PAGE);
    setPageData(currentPageData);
  }


  const pageCount = Math.ceil(holderData.length / PER_PAGE);

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", marginBottom: "30px", alignItems: "center" }}>
        <img src={logo} withd="150px" height="150px" />
        <Typography style={{ color: "#965E96", fontSize: "50px", lineHeight: "1.1", fontWeight: "600", marginLeft: "50px" }}>
          $MEME KONG Holders
        </Typography>
      </div>
      <div>
        <div style={{ marginBottom: "10px", display: "flex", justifyContent: "flex-end", color: "rgb(255, 69, 165)" }} >
          Total Balance: {Number(totalMkongAmount).toFixed(0) + 'MKONG, $' + Number(totalMkongAmount * tokenPrice).toFixed(1)}
        </div>
        <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }} >
          <TextField id="outlined-basic" label="New address" variant="outlined"
            style={{ width: "100%" }}
            value={newAddress}
            onChange={e => setAddressInputCallBack(e.target.value)}
          />
          <Button variant="outlined"
            color="success"
            className={classes.addAddressBtn}
            onClick={() => { addNewAddress(); }}
          >Add Address</Button>
        </div>
        <ReactPaginate
          previousLabel={"← "}
          nextLabel={" →"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />
        <div>

        </div>
        <Table bordered style={{ background: "#ac1fc41a", color: "white" }} size="30sm">
          <thead style={{ background: "#ac1fc430" }}>
            <tr>
              <th>Wallet Address</th>
              <th>Amount</th>
              <th>Value in USD</th>
            </tr>
          </thead>
          {
            pageData.length > 0 && (
              <tbody>
                {pageData.map((holder, index) => {
                  return (
                    <tr>
                      <td>{
                        isSmallScreen ? holder.address.slice(0, 5) +
                          "..." +
                          holder.address.substring(
                            holder.address.length - 3,
                            holder.address.length
                          ) : holder.address
                      }
                      </td>
                      <td>{Number(holder.amount).toFixed(3)}</td>
                      <td>{Number(holder.amount * tokenPrice).toFixed(1)} $</td>
                    </tr>
                  );
                })}
              </tbody>
            )}
        </Table>
      </div>
      <LineLoaderOverlay
        loading={loading}
        overlayColor="#000a"
        color="#fff"
        width={280}
        animationDuration={3}
        message={<div style={{ fontSize: "16px", marginTop: "10px" }}>{overlayText}...</div>}
      />
    </Container>
  );
}

export default HolderTable;
