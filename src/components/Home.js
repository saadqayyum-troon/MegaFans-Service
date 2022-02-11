import Web3 from "web3";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import StakingContractData from "../blockchain/StakingContract";
import GovernanceContractData from "../blockchain/GovernanceTokenContract";

const Home = () => {
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  const [walletConnected, setWalletConnected] = useState();
  const [currentSigner, setCurrentSigner] = useState();

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentSigner(accounts[0]);
        console.log(accounts[0]);
        setWalletConnected(true);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      alert(error.data.message);

      throw new Error("No Ethereum Object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask");
      // Request Metamask for accounts

      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.requestAccounts();
      setCurrentSigner(accounts[0]);
      console.log(accounts[0]);
      setWalletConnected(true);
    } catch (error) {
      alert(error.data.message);
      throw new Error("No Ethereum Object");
    }
  };

  const getBalance = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const balance = await web3.eth.getBalance(currentSigner);
    console.log(`${web3.utils.fromWei(balance, "Ether")} Matic`);
  };

  const getStakes = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const StakingContract = new web3.eth.Contract(
      StakingContractData.abi,
      StakingContractData.address
    );

    const stakes = await StakingContract.methods
      .getStakes(currentSigner)
      .call();
    console.log("Stakes ", stakes);
  };

  const stake = async () => {
    try {
      // Get Contracts
      const web3 = new Web3(Web3.givenProvider);
      const StakingContract = new web3.eth.Contract(
        StakingContractData.abi,
        StakingContractData.address
      );

      const GovernanceContract = new web3.eth.Contract(
        GovernanceContractData.abi,
        GovernanceContractData.address
      );

      // Approve Tokens for staking
      // Transaction
      const approve_tx = await GovernanceContract.methods
        .approve(StakingContractData.address, 1000000)
        .send({ from: currentSigner });

      // Stake
      // CallStatic
      await StakingContract.methods.stake(1000).call({ from: currentSigner });
      // Transaction
      const stake_tx = await StakingContract.methods
        .stake(1000)
        .send({ from: currentSigner });
    } catch (error) {
      console.log(error);
    }
  };

  const unstake = async () => {
    try {
      // Get Contracts
      const web3 = new Web3(Web3.givenProvider);
      const StakingContract = new web3.eth.Contract(
        StakingContractData.abi,
        StakingContractData.address
      );

      // Unstake Call Static
      await StakingContract.methods.unstake(1).call({ from: currentSigner });

      // Unstake Transaction
      const unstake_tx = await StakingContract.methods
        .unstake(1)
        .send({ from: currentSigner });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-5">
        <h1 className="text-lg">Smart Contract Service</h1>

        {/* Connect Wallet */}
        <div className="mt-10">
          {!walletConnected ? (
            <Button variant="contained" color="error" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Button variant="contained" color="success">
              Wallet Connected
            </Button>
          )}
        </div>

        {/* Get Balance */}
        <div className="mt-10">
          <Button variant="contained" color="info" onClick={getBalance}>
            Get Balance
          </Button>
        </div>

        {/* Get Stakes */}

        <div className="mt-10">
          <Button variant="contained" color="secondary" onClick={getStakes}>
            Get Stakes
          </Button>
        </div>
        {/* Stake */}

        <div className="mt-10">
          <Button variant="contained" color="warning" onClick={stake}>
            Stake
          </Button>
        </div>
        {/* Unstake */}
        <div className="mt-10">
          <Button variant="contained" onClick={unstake}>
            Unstake
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
