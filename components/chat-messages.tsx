"use client";

import type { Character } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "@/components/chat-message";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
    messages: ChatMessageProps[];
    isLoading: boolean;
    character: Character
}

export default function ChatMessages({ messages = [], isLoading, character }: ChatMessagesProps) {

    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false)

    const scrollRef = useRef<ElementRef<"div">>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false)
        }, 1000);

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])

    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage
                isLoading={fakeLoading}
                src={character.src}
                role="system"
                content={`Hey, I am ${character.name}, ${character.description}`}
            />
            {
                messages.map((message) => {
                    return (
                        <ChatMessage
                            key={message.content}
                            role={message.role}
                            content={message.content}
                            src={character.src}
                        />
                    )
                })
            }
            {
                isLoading && (
                    <ChatMessage
                        role="system"
                        isLoading
                        src={character.src}
                    />
                )
            }
            <div ref={scrollRef} />
        </div>
    )
}