"use client";
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import type { Character } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAccount } from "wagmi"


interface CharacterProps {
    data: (Character & {
        _count: {
            messages: number
        }
    })[]
}

export default function Characters({ data }: CharacterProps) {

    const { address } = useAccount();

    function maskAddress(address: string, lengthToShow: number):string {
        const maskedStart = address.slice(0, lengthToShow);
        const maskedEnd = address.slice(-lengthToShow);
        return `${maskedStart}...${maskedEnd}`;
    }

    if (data.length === 0) {
        return (
            <div className="pt-10 flex flex-col items-center jsutify-center space-y-3">
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        className="grayscale"
                        alt="Empty"
                        src="/empty.png"
                    />
                </div>
                <p>
                    No character found.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 pb-10">
            {
                data.map((item) => {
                    return (
                        <Card
                            key={item.id}
                            className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
                        >
                            <Link href={`/chat/?chatId=${item.id}&userWalletAddress=${address}`}>
                                <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                                    <div className="relative w-32 h-32">
                                        <Image
                                            fill
                                            src={item.src}
                                            alt="Character Image"
                                            className="rounded-xl object-cover"
                                        />
                                    </div>
                                    <p className="font-bold">
                                        {item.name}
                                    </p>
                                    <p className="text-xs">
                                        {item.description}
                                    </p>
                                </CardHeader>
                                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                                    <p className="lowercase">
                                        {maskAddress(item.userWalletAddress,5)}
                                    </p>
                                    <div className="flex items-center">
                                        <MessageSquare
                                            className="w-3 h-3 mr-1"
                                        />
                                        {item._count.messages}
                                    </div>
                                </CardFooter>
                            </Link>
                        </Card>
                    )
                })
            }
        </div>
    )
}