"use client";

import { Home, Plus, Settings } from "lucide-react";

const routes = [
    {
        icon:Home,
        href:"/",
        label:"Home",
        protected:false
    },
    {
        icon:Plus,
        href:"/companion/new",
        label:"Create",
        protected:true,
    },
    {
        icon:Settings,
        href:"/settings",
        label:"Settings",
        protected:false,
    },
]


export default function Sidebar() {
    return (
        <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
            <div className="p-3 flex-1 justify-center">
                <div className="space-y-2">
                    Routes
                </div>
            </div>
        </div>
    )
}