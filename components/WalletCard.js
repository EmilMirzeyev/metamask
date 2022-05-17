import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [assets, setAssets] = useState([])
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      
      console.log("MetaMask Here!");
      fetch(
        "https://api.opensea.io/api/v1/assets?owner=0x32dc96D9c14bb125D80E542Eb44a4C9252a16ceE"
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json.assets);
          setAssets(json.assets)
        });

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };
  useEffect(() => {
    // listen for account changes
    window.ethereum.on("accountsChanged", accountChangedHandler);

    window.ethereum.on("chainChanged", chainChangedHandler);
  }, []);

  return (
    <div className="walletCard">
      <h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <div className="accountDisplay">
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>
      <div>

      {assets.length && assets.map(nft => (
        <img src={nft.image_preview_url} alt="" />
      ))}
      </div>
      {errorMessage}
    </div>
  );
};

export default WalletCard;
