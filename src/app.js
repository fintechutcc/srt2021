const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
const privateKey = signerIdentity.privateKey;
const message = EthCrypto.hash.keccak256('Hello World message');
const signature = EthCrypto.sign(privateKey, message)

console.log('privateKey: ', privateKey);
console.log('message: ', message);
console.log('signature: ', signature);
console.log('signer public key: ', signerIdentity.address);

signerIdentity.privateKey = 0x4971dc2622eb71447e521fd379e00d75d39ea79876f063e7e7e4281b4b54590c;
const message1 = EthCrypto.hash.keccak256('Hello World message');
const signature1 = EthCrypto.sign(privateKey, message)

console.log('message: ', message1);
console.log('signature: ', signature1);
console.log('signer public key: ', signerIdentity.address);
