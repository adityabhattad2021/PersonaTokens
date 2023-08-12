"use client";

import type { Character, Message } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft, Edit3Icon, MessagesSquare, MoreVertical } from "lucide-react";
import BotAvatar from "@/components/bot-avatar";
import { useAccount } from "wagmi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
    character: Character & {
        messages: Message[];
        _count: {
            messages: number;
        }
    };
}

export default function ChatHeader({ character }: ChatHeaderProps) {

    const router = useRouter();
    const { address } = useAccount();
    const [isMounted,setIsMounted]=useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted) return null;

    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">
                <Button onClick={() => router.back()} size="icon" variant="ghost">
                    <ChevronLeft
                        className="h-8 w-8"
                    />
                </Button>
                <BotAvatar
                    src={character.src}
                />
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">
                            {character.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare
                                className="w-3 h-3 mr-1"
                            />
                            {character._count.messages}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Owned by {character.userWalletAddress}
                    </p>
                </div>
            </div>
            {address === character.userWalletAddress && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={()=>router.push(`/character/${character.id}`)}>
                            <Edit3Icon className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}