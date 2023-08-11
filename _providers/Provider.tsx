"use client";
import WagmiProvider from "./WagmiProvider";


interface ProviderType{
    children:React.ReactNode
}


export default function Provider({children}:ProviderType){
    return (
        <WagmiProvider>
            {children}
        </WagmiProvider>
    )
}