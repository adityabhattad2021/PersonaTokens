import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
) {
    try{
        const body = await req.json();

        const { characterId,userWalletAddress } = body;
        
        // TODO:Check if the user is the owner of the NFT.

        const character = await prismadb.character.update({
            where:{
                id:characterId,
            },
            data:{
                listed:false,
                userWalletAddress:userWalletAddress,
            }
        })
        return NextResponse.json(character);
    }catch(error){
        console.log('[MARKETPLACE_LIST_PATCH]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
