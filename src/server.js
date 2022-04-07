const truffleContract = require('truffle-contract');
const express = require("express")
const app = express();
const port = process.env.PORT || 3333

const EthCrypto = require("eth-crypto")
const signerIdentity = EthCrypto.createIdentity()
const privateKey = signerIdentity.privateKey

const Web3 = require("web3");
const srtArtifact = require("../build/contracts/SRTSignature.json");
const srtSig = truffleContract(srtArtifact);

const web3_provider_host =
  process.env.PRODUCTION_WEB3_PROVIDER_HOST || "http://127.0.0.1";
const web3_provider_port = process.env.PRODUCTION_WEB3_PROVIDER_PORT || 8545;
const provider = `${web3_provider_host}:${web3_provider_port}`;

const web3 = new Web3(new Web3.providers.HttpProvider(provider));

// ******************************************************************** //
//replace with your smart contract address
const srtContractAddress = "0xE3F3006307F382bdE29c33fFe1941244AdD9f4d3";
// ******************************************************************** //

const privateKeys = [
  "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
];

const address = [
  web3.eth.accounts.privateKeyToAccount(privateKeys[0]).address,
  web3.eth.accounts.privateKeyToAccount(privateKeys[1]).address,
  web3.eth.accounts.privateKeyToAccount(privateKeys[2]).address,
];

function getContract() {
  let c = new web3.eth.Contract(srtArtifact.abi, srtContractAddress);
  contract = c.clone();
  return contract;
}

module.exports = {
  privateKeys: privateKeys,
  address: address,
  web3: web3,
  getContract: getContract,
  srtContractAddress: srtContractAddress,
  host: process.env.APP_HOST || "127.0.0.1",
  port: process.env.APP_PORT || 3003,
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("SRT Blockchain APIs.")
})

app.post('/sign', (req, res) => {
  let doc = req.body
  let message = EthCrypto.hash.keccak256(doc.docMessage)
  let signature = EthCrypto.sign(privateKey, message)

  try {
    const instance = srtSig.deployed();
    const value = instance.verifyDocument.call(docId, docSig);
    const result = value.toString();

    return JSON.stringify({
      signature: signature
    });
  } catch (error) {
    console.log(error)
    throw new BadRequestException({ description: 'Unable to verify a document.\n' });
  }

  res.send(`{"Signature": "${signature}"}`)
})

app.post('/verify', (req, res) => {
  let doc = req.body
  let message = EthCrypto.hash.keccak256(doc.docMessage)
  let signature = EthCrypto.sign(privateKey, message)

  try {
    const instance = srtSig.deployed();
    const value = instance.verifyDocument.call(docId, docSig);
    const result = value.toString();

    return JSON.stringify({
      verified: result
    });
  } catch (error) {
    console.log(error)
    throw new BadRequestException({ description: 'Unable to verify a document.\n' });
  }

  res.send(`{"verified": "${result}"}`)
})

app.listen(port, () => {
  console.log("Starting SRT Blockchain APIs at port " + port)
});