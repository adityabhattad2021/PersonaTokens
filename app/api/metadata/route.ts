import prismadb from '@/lib/prismadb';
import { storeNFT } from '@/lib/upload-nft-metadata';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, image } = body;

    // console.log(name,description,image);
    

    if (!name || !description || !image) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const NFTMetadata=await storeNFT(name,description,image);

    return NextResponse.json(NFTMetadata.ipnft);
  } catch (error) {
    console.log('[MINT_NFT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
