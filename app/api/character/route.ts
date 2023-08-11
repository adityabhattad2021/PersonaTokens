import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { src, name, description, instructions, seed, categoryId } = body;

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const character = await prismadb.character.create({
        data:{
            categoryId,
            userId:"asasd",
            userWalletAddress:"0x123",
            src,
            name,
            description,
            instructions,
            seed
        }

    })
    return NextResponse.json(character);

  } catch (error) {
    console.log('[CHARACTER_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
