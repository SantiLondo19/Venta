import { Dapp } from './pages/Dapp';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.localhost, chain.hardhat, chain.goerli],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Venta',
  chains,
});

const wagmiClient = createClient({
  connectors,
  provider
})

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Dapp />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
