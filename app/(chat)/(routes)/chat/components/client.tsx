"use client"
import ChatHeader from "@/components/chat-header";
import type { Character, Message } from "@prisma/client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";
import { useAccount } from "wagmi";


interface ChatClientProps {
    character: Character & {
        messages: Message[];
        _count: {
            messages: number;
        }
    };
};

export default function ChatClient({ character }: ChatClientProps) {

    const {address}=useAccount();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageProps[]>(character.messages);

    const {
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        setInput
    } = useCompletion({
        api: `/api/chat/${character.id}`,
        onFinish(prompt,completion) {
            const systemMessage: ChatMessageProps = {
                role: "system",
                content: completion,
            }
            console.log(completion);
            
            setMessages((current) => [...current, systemMessage]);
            setInput("")
            router.refresh();
        },
        onError(error){
            console.log(error);
            router.refresh();
        },
        body:{
            userWalletAddress:address
        }
    });

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        const userMessage: ChatMessageProps = {
            role: "user",
            content: input,
        };

        setMessages((current) => [...current, userMessage]);
        handleSubmit(e);
    }

   
    
    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader
                character={character}
            />
            <ChatMessages
                character={character}
                isLoading={isLoading}
                messages={messages}
            />
            <ChatForm
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                handleOnSubmit={onSubmit}
            />
        </div>
    )
}