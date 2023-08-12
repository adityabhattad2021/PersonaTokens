"use client";

import { MessageSquare, Router } from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CharacterInfoProps {
    character: {
        id: string,
        userWalletAddress: string,
        src: string,
        name: string,
        description: string,
        listed: boolean,
        createdAt: Date,
        updatedAt: Date,
        category: Category,
        categoryId: string,
        tokenId: number,
        _count: {
            messages: number,
        }
    }
}

export default function CharacterInfo({ character }: CharacterInfoProps) {

    const router = useRouter();
    const { address } = useAccount();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;

    return (
        <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="relative w-96 h-96">
                <Image
                    className="rounded-xl"
                    fill
                    src={character.src}
                    alt="Character Image"
                />
            </div>
            <div className="w-96 mt-10 md:mt-16 flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-medium">
                        {character.name} #{character.tokenId}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {character.description}
                    </p>
                    <p className="flex  justify-start items-center text-md text-muted-foreground">
                        <MessageSquare
                            className="w-3 h-3 mr-1"
                        />
                        {character._count.messages}
                    </p>
                </div>
                {address === character.userWalletAddress ? (
                    <div className="w-full flex justify-around md:justify-normal gap-10">
                        <Button className="w-32 md:w-44 text-lg tracking-wide" size={"lg"}>
                            List
                        </Button>
                        <Button className="w-32 md:w-44 text-lg tracking-wide" size={"lg"} onClick={() => router.push(`/chat/?chatId=${character.id}&userWalletAddress=${address}`)}>
                            Chat
                        </Button>
                    </div>
                ) : (
                    <div className="w-full flex justify-around md:justify-normal gap-10">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn("w-full",!character.listed && "cursor-not-allowed")}>
                                        <Button className="w-full text-lg tracking-wide" size={"lg"} disabled={!character.listed} onClick={()=>alert("clicked")}>
                                            Buy
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{character.listed ? `Buy ${character.name}` : "Not listed for sale."}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </div>
    )
}