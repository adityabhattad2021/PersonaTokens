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
import { Plus, Settings, StoreIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const font = Poppins({
    weight: "600",
    subsets: ['latin']
})

const routes = [
    {
        icon: StoreIcon,
        href: "/marketplace",
        label: "Marketplace",
        logined: false
    },
    {
        icon: Plus,
        href: "/character/new",
        label: "Create",
        logined: true,
    },
]


export default function Navbar() {

    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect()
    const { open } = useWeb3Modal()
    const router=useRouter();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;

    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar />
                <Link
                    href="/"
                >
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>
                        personatokens.ai
                    </h1>
                </Link>
            </div>

            <div className="flex items-center gap-x-3">
                <div className="hidden md:flex gap-7 pr-20">
                    {routes.map((route) => {
                        return (
                            <Button variant="ghost" onClick={()=>router.push(route.href)} key={route.href}>
                                <h1 className={cn("font-bold text-lg cursor-pointer", font.className)} >
                                    {route.label}
                                </h1>
                            </Button>
                        )
                    })}
                </div>
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