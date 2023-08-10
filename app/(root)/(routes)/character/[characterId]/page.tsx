interface CharacterIdPageProps {
    params:{
        characterId:string;
    }
}



export default async function CharacterIdPage({
    params
}:CharacterIdPageProps){
    return (
        <div>
            Character Id Page
        </div>
    )
}