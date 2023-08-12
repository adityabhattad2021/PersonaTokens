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


    // TODO: Check if the user own this character before allowing him to edit character in the database.
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