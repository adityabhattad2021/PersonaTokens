import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(
    req: Request,
    {params}:{params:{characterId:string}}
) {
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

    const character = await prismadb.character.update({
        where:{
            id:params.characterId,
        },
        data:{
            categoryId,
            src,
            name,
            description,
            instructions,
            seed
        }

    })
    return NextResponse.json(character);

  } catch (error) {
    console.log('[CHARACTER_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
