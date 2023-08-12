import Categories from "@/components/categories";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import Characters from "@/components/characters";
import { Separator } from "@/components/ui/separator";


interface ProfilePageProps {
    params:{
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
            <div className="my-4 w-full flex flex-col gap-2 justify-start pl-6">
                <h3 className="text-xl md:text-2xl font-medium transition">
                    Your owned characters
                </h3>
                <p className="text-md md:text-xl text-muted-foreground transition">
                    You can view and manage your characters here.
                </p>
            </div>
            <Separator className="bg-primary/10 mb-4" />
            <Characters
                data={data}
            />
        </div>
    )
}
