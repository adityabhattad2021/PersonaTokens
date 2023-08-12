import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";

interface ChatPageProps {
    searchParams: {
        chatId: string;
        userWalletAddress: string;
    }
}


export default async function ChatPage({ searchParams }: ChatPageProps) {

    const character = await prismadb.character.findUnique({
        where: {
          id: searchParams.chatId
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc"
            },
            where: {
              userWalletAddress:searchParams.userWalletAddress,
            },
          },
          _count: {
            select: {
              messages: true,
            }
          }
        }
      });

    if (!character) {
        return redirect('/')
    }

    return (
        <ChatClient
            character={character}
        />
    )
}