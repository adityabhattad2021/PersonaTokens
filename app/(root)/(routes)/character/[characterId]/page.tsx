import prismadb from "@/lib/prismadb";
import CharacterForm from "./components/character-form";

interface CharacterIdPageProps {
    params:{
        characterId:string;
    }
}



export default async function CharacterIdPage({
    params
}:CharacterIdPageProps){

    const character = await prismadb.character.findUnique({
        where:{
            id:params.characterId,
        }
    })

    const categories = await prismadb.category.findMany();

    return (
        <CharacterForm
            initialData={character}
            categories={categories}
        />
    )
}