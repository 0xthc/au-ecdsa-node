import { useEffect } from 'react'

import server from './server'

function Wallet({ address, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  useEffect(() => {
    if (address) {
      server.post('/initAddress', { address, amount: 50 }).then(() => setBalance(50))
    }
  }, [address])

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange} disabled></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
