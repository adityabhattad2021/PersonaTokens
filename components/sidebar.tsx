"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, Plus, Settings, StoreIcon, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";


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
    {
        icon: User2,
        href: "/profile",
        label: "Profile",
        logined: true,
    },
]

interface Route {
    icon: LucideIcon;
    href: string;
    label: string;
    logined: boolean;
}

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();
    const { address } = useAccount();

    function onNavigate(route: Route) {
        if (route.label === "Profile") {
            return router.push(`${route.href}/${address}`)
        }
        return router.push(route.href);
    }

    return (
        <div className="space-y-4 flex flex-col h-full text-primary bg-secondary p-2">
            <div className="p-3 flex flex-1 justify-center">
                <div className="space-y-2">
                    {routes.map((route) => {
                        return (
                            <div
                                onClick={() => onNavigate(route)}
                                key={route.href}
                                className={cn("text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                    pathname === route.href && "bg-primary/10 text-primary")}>
                                <div className="flex flex-col flex-1 gap-y-2 items-center ">
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}