const express = require("express");
const app = express();
const cors = require("cors");
const ethers = require("ethers");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// Added init address for prefilling funds
app.post("/initAddress", (req, res) => {
  const { address, amount } = req.body
  setInitialBalance(address, amount);
  res.status(200).send()
})

app.post("/send", (req, res) => {
  const { hash, payload } = req.body;
  const senderAddress = ethers.verifyTypedData(payload.domain, payload.types, payload.value, hash)
  if (senderAddress === payload.value.from.wallet) {
    const recipient = payload.value.to.wallet
    const amount = Number(payload.value.amount)
    
    if (!balances[senderAddress]) {
      setInitialBalance(senderAddress);
    }
    if (!balances[recipient]) {
      setInitialBalance(recipient);
    }
  
    if (balances[senderAddress] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[senderAddress] -= amount;
      balances[recipient] += amount;
      console.log(balances)
      res.send({ balance: balances[senderAddress] });
    }
  } else {
    res.status(403).send()
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address, amount = 0) {
  if (!balances[address]) {
    balances[address] = amount;
  }
}
