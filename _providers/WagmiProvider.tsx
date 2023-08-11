import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { optimismGoerli, baseGoerli } from 'wagmi/chains'

interface WagmiProviderType {
    children: React.ReactNode;
};

const chains = [baseGoerli, optimismGoerli];
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
});


const ethereumClient = new EthereumClient(wagmiConfig, chains);


export default function WagmiProvider({children}:WagmiProviderType){
    return (
        <>
            <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} defaultChain={baseGoerli}/>
        </>
    )
}