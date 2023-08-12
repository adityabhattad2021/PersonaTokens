"use client";

import * as z from "zod";
import axios from "axios";
import type { Category, Character } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PREAMBLE, SEED_CHAT } from "@/constants/instructions"
import { Button } from "@/components/ui/button";
import { Wand2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { writeContract, waitForTransaction } from "@wagmi/core";
import { InjectedConnector } from "wagmi/connectors/injected";
import { personaTokenABI, personaTokenAddress } from "@/constants/smart-contracts";
import { baseGoerli } from "wagmi/chains";
import { fromHex } from 'viem'

interface CharacterFormProps {
    initialData: Character | null;
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
    categoryId: z.string().min(1, {
        message: "Category is requireasdasdasdd"
    }),
    instructions: z.string().min(200, {
        message: "Instructions needs to be atleast 200 characters long"
    }),
    seed: z.string().min(200, {
        message: "Seed needs to be atleast 200 characters long",
    }),
    src: z.string().min(1, {
        message: "Image is required",
    }),

})

export default function CharacterForm({
    categories,
    initialData
}: CharacterFormProps) {
    
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector({
            chains: [baseGoerli],
        }),
    });

    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function handleOnSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!isConnected) {
                connect();
            }
            if (initialData) {
                await axios.patch(`/api/character/${initialData.id}`, values);
            } else {
                const characterMetadata = await axios.post('/api/metadata', { name: values.name, description: values.description, image: values.src });

                const characterMetadataURI = `ipfs://${characterMetadata.data}/metadata.json`

                const { hash } = await writeContract({
                    address: personaTokenAddress,
                    abi: personaTokenABI,
                    functionName: "safeMint",
                    args: [
                        characterMetadataURI
                    ],
                    chainId: baseGoerli.id,
                });

                console.log("Hash of the transaction (watching)", hash);
                const data = await waitForTransaction({
                    hash,
                });

                await axios.post('/api/character', { ...values, address, tokenId: fromHex(data.logs[0].topics[3] as `0x${string}`, "number") });
                toast({
                    variant: "default",
                    description: "Successfully minted the character!"
                })
                router.refresh();
                router.push("/");
            }

        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong, try again later."
            })
            console.log('SOMETHING WENT WRONG', error);
        }
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General Information about your character
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="src"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col items-center justify-center space-y-4">
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Rocket Racoon"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is what the created character will identify itself as.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Member of the legendary guardians of the galaxy."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Short description for your AI character.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            name="categoryId"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Category
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-brackground">
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a category"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    categories.map((category) => {
                                                        return (
                                                            <SelectItem
                                                                key={category.id}
                                                                value={category.id}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select a category for your AI character.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed instructions to determine how should the created character behave.
                            </p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="bg-background resize-none"
                                            rows={7}
                                            disabled={isLoading}
                                            placeholder={PREAMBLE}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Give as detailed discription for your character as possible.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        name="seed"
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Example Conversation</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="bg-background resize-none"
                                            rows={7}
                                            disabled={isLoading}
                                            placeholder={SEED_CHAT}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Some example conversation to set the tone for your character.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <div className="w-full flex justify-center">
                        <Button size={"lg"} disabled={isLoading}>
                            {initialData ? "Edit your character" : "Create your character"}
                            <Wand2Icon
                                className="w-4 h-4 ml-2"
                            />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}