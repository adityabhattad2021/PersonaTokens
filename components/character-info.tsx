"use client";

import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTheme } from "next-themes";

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

const formSchema = z.object({
    priceInETH: z.string().transform((val) => parseFloat(val)).refine((n) => n > 0, {
        message: "Price must be greater than 0",
    }),
});


export default function CharacterInfo({ character }: CharacterInfoProps) {

    const router = useRouter();
    const { address } = useAccount();

    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            priceInETH: 1.00,
        },
    })


    async function handleSellNFT(values: z.infer<typeof formSchema>) {
        alert(values.priceInETH);
        setOpen(false);
    }

    function handleBuyNFT() {

    }

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
            <div className="w-96 mt-2 md:mt-16 flex flex-col gap-10">
                <div className="flex flex-col gap-4 ml-4 md:ml-0">
                    <h1 className="text-4xl font-medium">
                        {character.name} #{character.tokenId}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {character.description}
                    </p>
                    <div className="flex  justify-start items-center text-md text-muted-foreground">
                        <MessageSquare
                            className="w-3 h-3 mr-1"
                        />
                        {character._count.messages}
                    </div>
                </div>
                {address === character.userWalletAddress ? (
                    <div className="w-full flex justify-around md:justify-normal gap-10">
                        <AlertDialog open={open} onOpenChange={setOpen} >
                            <AlertDialogTrigger className={cn("w-40 bg-white text-black rounded-lg md:w-44 text-lg tracking-wide transition",theme==="light" && "bg-black text-white")}>
                                List
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleSellNFT)}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Sell {character.name}?</AlertDialogTitle>
                                            {/* <AlertDialogDescription> */}
                                                <FormField
                                                    name="priceInETH"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem>
                                                                <FormLabel>Set price</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="rounded-lg bg-primary/10"
                                                                        placeholder="1.00"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Enter price in ETH.
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            {/* </AlertDialogDescription> */}
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel >Cancel</AlertDialogCancel>
                                            <AlertDialogAction type="submit">Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </form>
                                </Form>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button className="w-40 md:w-44 text-lg tracking-wide" size={"lg"} onClick={() => router.push(`/chat/?chatId=${character.id}&userWalletAddress=${address}`)}>
                            Chat
                        </Button>
                    </div>
                ) : (
                    <div className="w-full flex justify-around md:justify-normal gap-10">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn("w-full", !character.listed && "cursor-not-allowed")}>
                                        <Button className="w-full text-lg tracking-wide" size={"lg"} disabled={!character.listed} onClick={() => handleBuyNFT}>
                                            Buy
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div>{character.listed ? `Buy ${character.name}` : "Not listed for sale."}</div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </div>
    )
}