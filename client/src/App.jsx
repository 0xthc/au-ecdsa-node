import { useState } from 'react'
import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi'

import './App.scss'

import Wallet from './Wallet'
import Transfer from './Transfer'


function App() {
  const [balance, setBalance] = useState(0)

  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId({ chainId: 5 })

  const handleConnect = () => {
    try {
      connect({
        connector: connectors[0], // metamask
        chainId // chainId = 5, goerli is Ethereum testnet
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <>
      <div className='app'>
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
        />
        <Transfer setBalance={setBalance} address={address} />
      </div>
      {isConnected ? (
        <button onClick={handleDisconnect}>Disconnect Wallet</button>
      ) : <button onClick={handleConnect}>Connect Wallet</button>}
    </>
  )
}

export default App
