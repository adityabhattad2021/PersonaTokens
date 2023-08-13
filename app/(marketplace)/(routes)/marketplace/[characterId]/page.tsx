import CharacterInfo from "@/components/character-info";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface CharacterInfoPageProps {
    params: {
        characterId: string;
    }
}

export default async function CharacterInfoPage({ params }: CharacterInfoPageProps) {

    const character = await prismadb.character.findUnique({
        where: {
            id: params.characterId
        },
        select: {
            id: true,
            userWalletAddress: true,
            src: true,
            name: true,
            description: true,
            listed: true,
            createdAt: true,
            updatedAt: true,
            category: true,
            categoryId: true,
            tokenId: true,
            _count: {
                select: {
                    messages: true,
                }
            }
        },
    })

    if (!character) {
        return redirect('/marketplace')
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto justify-center items-center flex flex-col gap-20">
            <CharacterInfo
                character={character}
            />
        </div>
    )
}