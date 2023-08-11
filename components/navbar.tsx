"use client";

import { cn } from "@/lib/utils";
import { MenuIcon, Sparkles, Wallet } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import MobileSidebar from "@/components/mobile-sidebar";
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

const font = Poppins({
    weight: "600",
    subsets: ['latin']
})

export default function Navbar() {

    const { isConnected} = useAccount();
    const {disconnect}=useDisconnect()
    const { open, } = useWeb3Modal()

    const [isMounted,setIsMounted]=useState(false);

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted) return null;

    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar />
                <Link
                    href="/"
                >
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary")}>
                        personatokens.ai
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                <Button size="sm" onClick={() => isConnected ? disconnect() : open()}>
                    {isConnected ? 'Disconnect' : 'Connect'}
                    <Wallet
                        className="h-4 w-4 fill-white ml-2"
                    />
                </Button>
                <ModeToggle />
            </div>
        </div>
    )
}