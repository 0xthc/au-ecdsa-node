import { useState } from "react";
import { useSignTypedData } from 'wagmi'

import server from "./server";

const domain = {
  name: 'Goerli',
  version: '5.7.2',
  chainId: 5,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'string' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'amount', type: 'string' },
  ],
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const { signTypedData } = useSignTypedData({
    domain,
    types,
    value: {
      from: {
        name: 'Cow',
        wallet: address,
      },
      to: {
        name: 'Bob',
        wallet: recipient,
      },
      amount: sendAmount,
    },
    onError: (err) => console.log(err),
    onSuccess: data => transfer(data)
  })

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function sign(evt) {
    evt.preventDefault();
    signTypedData()
  }

  async function transfer(data) {
    try {
      const {
        data: { balance },
      } = await server.post(`send`, { hash: data, payload:
        {
          domain,
          types,
          value: {
            from: {
              name: 'Cow',
              wallet: address,
            },
            to: {
              name: 'Bob',
              wallet: recipient,
            },
            amount: sendAmount,
          },
        }
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={sign}>
      <h1>Sign Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Sign" />
    </form>
  );
}

export default Transfer;
