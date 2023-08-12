import { StreamingTextResponse, LangChainStream } from 'ai';
import { CallbackManager } from 'langchain/callbacks';
import { Replicate } from 'langchain/llms/replicate';
import { NextResponse } from 'next/server';

import { CharacterKey, MemoryManager } from '@/lib/memory';
import { rateLimit } from '@/lib/rate-limit';
import prismadb from '@/lib/prismadb';

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt, userWalletAddress } = await request.json();

    const identifier = request.url + '-' + userWalletAddress;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }

    const character = await prismadb.character.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: 'user',
            userWalletAddress: userWalletAddress,
          },
        },
      },
    });

    if (!character) {
      return new NextResponse('Character not found', { status: 404 });
    }

    if (character.userWalletAddress !== userWalletAddress) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const name = character.id;
    const character_file_name = name + '.txt';

    const characterKey: CharacterKey = {
      characterName: name,
      userWalletAddress: userWalletAddress,
      modelName: 'llama2-13b',
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(characterKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(character.seed, '\n\n', characterKey);
    }

    await memoryManager.writeToHistory('User: ' + prompt + '\n', characterKey);

    const recentChatHistory = await memoryManager.readLatestHistory(
      characterKey
    );

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      character_file_name
    );

    let relevantHistory = '';

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n');
    }

    const { handlers } = LangChainStream();

    const model = new Replicate({
      model:
        'a16z-infra/llama-2-13b-chat:2a7f981751ec7fdf87b5b91ad4db53683a98082e9ff7bfd12c8cd5ea85980a52',
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;

    const resp = String(
      await model
        .call(
          `
                    Only generate plain sentences without prefix of who is speaking. DO NOT use ${name} : prefix.

                    ${character.instructions}

                    Below are the relavent details about ${name}'s past conversations you are in.
                    ${relevantHistory}

                    ${recentChatHistory}\n${name}
                `
        )
        .catch(console.error)
    );

    const cleaned = resp.replaceAll(',', '');
    const chunks = cleaned.split('\n');
    const response = chunks[0];

    await memoryManager.writeToHistory('' + response.trim(), characterKey);
    var Readable = require('stream').Readable;

    let s = new Readable();
    s.push(response);
    s.push(null);

    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory('' + response.trim(), characterKey);

      await prismadb.character.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: 'system',
              userWalletAddress: userWalletAddress,
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);
  } catch (error) {
    console.log('[CHAT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
