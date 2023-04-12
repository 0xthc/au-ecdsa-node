import React from 'react'
import ReactDOM from 'react-dom/client'
import { goerli } from 'wagmi/chains'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import App from './App'

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: '' })],
)
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
)