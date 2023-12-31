"use client";

import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTheme } from "next-themes";
import { InjectedConnector } from "wagmi/connectors/injected";
import { baseGoerli } from "wagmi/chains";
import { writeContract, waitForTransaction, readContract } from "@wagmi/core";
import { parseEther, formatEther } from 'viem'
import { NFTMarketplaceABI, NFTMarketplaceAddress, personaTokenABI, personaTokenAddress } from "@/constants/smart-contracts";
import { useToast } from "@/components/ui/use-toast";
import { maskAddress } from "@/lib/mask-address";


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

    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector({
            chains: [baseGoerli],
        }),
    });

    const { toast } = useToast();
    const router = useRouter();

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
        try {
            if (!isConnected) {
                connect();
            }
            if (values.priceInETH > 0) {
                const { hash: approveHash } = await writeContract({
                    address: personaTokenAddress,
                    abi: personaTokenABI,
                    functionName: "approve",
                    args: [
                        NFTMarketplaceAddress,
                        character.tokenId,
                    ],
                    chainId: baseGoerli.id,
                });
                console.log("Hash of the transaction (watching)", approveHash);
                const approveData = await waitForTransaction({
                    hash: approveHash,
                });
                console.log("Transaction mined (Approve NFT)", approveData);

                toast({
                    variant: "default",
                    description: "Successfully approved NFT for sale!"
                })

                const { hash: listHash } = await writeContract({
                    address: NFTMarketplaceAddress,
                    abi: NFTMarketplaceABI,
                    functionName: "listItem",
                    args: [
                        personaTokenAddress,
                        character.tokenId,
                        parseEther(values.priceInETH.toString()),
                    ],
                    chainId: baseGoerli.id,
                });
                console.log("Hash of the transaction (watching)", listHash);
                const listData = await waitForTransaction({
                    hash: listHash,
                });
                console.log("Transaction mined (List NFT)", listData);
                await axios.patch("/api/marketplace/list", {
                    characterId: character.id,
                });
                toast({
                    variant: "default",
                    description: "Successfully listed NFT for sale!"
                })
                router.refresh();
                router.push("/");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong, try again later."
            })
            console.log(error);
        }
    }

    async function handleBuyNFT() {
        try {
            const data = await readContract({
                address: NFTMarketplaceAddress,
                abi: NFTMarketplaceABI,
                functionName: "getTokenListedPrice",
                args: [
                    personaTokenAddress,
                    character.tokenId,
                ]
            })

            const { hash: buyNftHash } = await writeContract({
                address: NFTMarketplaceAddress,
                abi: NFTMarketplaceABI,
                functionName: "buyItem",
                args: [
                    personaTokenAddress,
                    character.tokenId,
                ],
                chainId: baseGoerli.id,
                value: data as bigint,
            });

            console.log("Hash of the transaction (watching)", buyNftHash);
            const buyData = await waitForTransaction({
                hash: buyNftHash,
            });
            console.log("Transaction mined (Buy NFT)", buyData);
            await axios.patch("/api/marketplace/buy", {
                characterId: character.id,
                userWalletAddress: address,
            });
            toast({
                variant: "default",
                description: `${character.name} has been purchased for ${formatEther(data as bigint)} ETH!`
            })
            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong, try again later."
            })
            console.log(error);
        }
    }

    async function handleUnlistNFT() {
        try {
            const { hash: unlistHash } = await writeContract({
                address: NFTMarketplaceAddress,
                abi: NFTMarketplaceABI,
                functionName: "cancelListing",
                args: [
                    personaTokenAddress,
                    character.tokenId,
                ],
                chainId: baseGoerli.id,
            });
            console.log("Hash of the transaction (watching)", unlistHash);
            const unlistData = await waitForTransaction({
                hash: unlistHash,
            });
            console.log("Transaction mined (Unlist NFT)", unlistData);
            await axios.patch("/api/marketplace/unlist", {
                characterId: character.id,
            });
            toast({
                variant: "default",
                description: "Successfully unlisted NFT!"
            })
            router.refresh();
            router.push("/marketplace");
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong, try again later."
            })
            console.log(error);
        }
    }

    if (!isMounted) return null;

    return (
        <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
                <Image
                    className="rounded-xl"
                    fill
                    src={character.src}
                    alt="Character Image"
                />
            </div>
            <div className="w-80 h-80 md:w-96 md:h-96 mt-2 md:mt-16 flex flex-col gap-10">
                <div className="flex flex-col gap-4 ml-4 md:ml-0">
                    <h1 className="text-2xl md:text-4xl font-medium">
                        {character.name} #{character.tokenId}
                    </h1>
                    <p className="text-sm md:text-lg text-muted-foreground">
                        {character.description}
                    </p>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-xs md:text-sm text-accent-foreground cursor-pointer">
                                    <span className="font-bold">Owned by:</span> {maskAddress(character.userWalletAddress,7)}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {character.userWalletAddress}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex justify-start items-center text-md text-muted-foreground">
                        <MessageSquare
                            className="w-3 h-3 mr-1"
                        />
                        {character._count.messages}
                    </div>
                </div>
                {address === character.userWalletAddress ? (
                    <div className="w-full flex justify-around md:justify-normal gap-6 md:gap-10">
                        <AlertDialog open={open} onOpenChange={setOpen} >
                            <AlertDialogTrigger className={cn("w-40 bg-white text-black rounded-lg md:w-44 text-lg tracking-wide transition", theme === "light" && "bg-black text-white")}>
                                {character.listed ? 'Unlist' : 'List'}
                            </AlertDialogTrigger>
                            {!character.listed ? (
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

                            ) : (
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Sell {character.name}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Your Character will no longer be listed for sale.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleUnlistNFT}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>

                                </AlertDialogContent>
                            )}
                        </AlertDialog>
                        <Button className="w-40 md:w-44 text-lg tracking-wide" size={"lg"} onClick={() => router.push(`/chat/?chatId=${character.id}&userWalletAddress=${address}`)}>
                            Chat
                        </Button>
                    </div>
                ) : (
                    <div className="w-full flex justify-around md:justify-normal p-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn("flex w-full justify-center", !character.listed && "cursor-not-allowed")}>
                                        <Button className="text-lg w-60 md:w-80 tracking-wide" size={"lg"} disabled={!character.listed} onClick={handleBuyNFT}>
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