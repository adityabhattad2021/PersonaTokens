import prismadb from "@/lib/prismadb";
import Characters from "@/components/characters";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { maskAddress } from "@/lib/mask-address";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UserInfo from "@/components/user-info";

interface ProfilePageProps {
    params: {
        userAddress: string;
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {

    const data = await prismadb.character.findMany({
        where: {
            userWalletAddress: params.userAddress,
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    messages: true,
                }
            }
        }
    })

    return (
        <div className="h-full p-4 space-y-2">
            <UserInfo
                userWalletAddresss={params.userAddress}
                userOwnedNFTs={data.length}
            />
            <Separator className="bg-primary/10 mb-4" />
            <div className="h-4"></div>
            <Characters data={data} />
        </div>
    )
}
