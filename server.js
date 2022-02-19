// Express server
const express = require('express');
const app = express();
const port = 4000;

// Bitcoin
const bjs = require('bitcoinjs-lib');
const mainnet = bjs.networks.bitcoin; // Bitcoin mainnet
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);

// QR Code
var QRCode = require("qrcode-svg");

// Set your xpub
var xpub = 'xpub6BisCNkALWmei9XgBA5ouUH6eKK3LmM51Q2TQQaVq2W9iFLWpC47opwYanxBYuTzFXFYPPyU5sHBM5BbcihddLArTRapLZokVHXvDN6nxjd';

// Index increments by +1 each view
var addressIncrement = 0;

// Get address
function getAddress(increment) {
  const { address } = bjs.payments.p2wpkh({
    pubkey: bip32.fromBase58(xpub).derive(0).derive(increment).publicKey,
  });
  return address;
}

// Primary endpoint
app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  (async() => {
    let address = getAddress(addressIncrement);
    let qrCodeSvg = new QRCode(address).svg();
    // Return address and base64 QR code
    res.send(
      JSON.stringify({
        'address': address,
        'qr': qrCodeSvg.replace('\r\n','')
      })
    );
  })();

  // Log the last index, then increment it by 1
  console.log('Last index: '+addressIncrement.toString());
  addressIncrement += 1;
});

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});