import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const balaceButton = document.getElementById("balanceButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
balaceButton.onclick = getBalance;




async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    document.getElementById("connectButton").innerHTML = "Connected";
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please Install Meta-mask!";
  }
}

async function fund() {
  const etherAmmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum) {
    //provider /connection to the blockahain
    //signer / wallet / someone with some gas
    //contract that we are interacting with
    // ^ ABI & Address

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(etherAmmount),
      });

      //hey, wait for this tx to finsh
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  // listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve()
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    console.log("Withdrawing...")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse,provider)
    } catch (error) {
      console.log(error)
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}
