import prismadb from "@/lib/prismadb";

interface CharacterInfoPageProps{
    params:{
        characterId:string;
    }
}

export default async function CharacterInfoPage({params}:CharacterInfoPageProps){

    const character = await prismadb.character.findUnique({
        where:{
            id:params.characterId
        }
    })

    return (
        <div>
            Character Info
        </div>
    )
}