import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      src,
      name,
      description,
      instructions,
      seed,
      categoryId,
      address,
      tokenId,
    } = body;

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId ||
      !address
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const character = await prismadb.character.create({
      data: {
        categoryId,
        userWalletAddress: address,
        src,
        name,
        description,
        instructions,
        seed,
        tokenId,
        listed: false,
      },
    });
    return NextResponse.json(character);
  } catch (error) {
    console.log('[CHARACTER_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
