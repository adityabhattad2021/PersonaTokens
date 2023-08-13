import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { StreamingTextResponse, } from 'ai';
import { BaseCallbackHandler, } from 'langchain/callbacks';
import { PromptTemplate } from 'langchain/prompts';
import { NextResponse } from 'next/server';

import { CharacterKey, MemoryManager } from '@/lib/memory';
import { rateLimit } from '@/lib/rate-limit';
import { Serialized } from 'langchain/load/serializable';
import prismadb from '@/lib/prismadb';

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt, userWalletAddress } = await request.json();

    const identifier = request.url + '-' + (userWalletAddress || 'anonymous');
    const { success } = await rateLimit(identifier);

    if (!success) {
      console.log('INFO: rate limit exceeded');
      return new NextResponse(
        JSON.stringify({ Message: "Hi, the companions can't talk this fast." }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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

    const characterKey: CharacterKey = {
      characterName: character.name,
      userWalletAddress: userWalletAddress,
      modelName: 'chatgpt',
    };

    const name = character.name.toLowerCase();
    const character_file_name = name + '.txt';

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(characterKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(character.seed, '\n\n', characterKey);
    }

    await memoryManager.writeToHistory('User: ' + prompt + '\n', characterKey);

    let recentChatHistory = await memoryManager.readLatestHistory(characterKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      character_file_name
    );

    let relevantHistory = '';

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n');
    }


    class CustomHandler extends BaseCallbackHandler {
      name = 'custom_handler';

      handleLLMStart(llm: Serialized, _prompts: string[]) {
        console.log('Started generating the response...');
      }
    }

    const handler1 = new CustomHandler();

    const model = new OpenAI({
      streaming: true,
      modelName: 'gpt-3.5-turbo-16k',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    model.verbose = true;

    const chainPrompt = PromptTemplate.fromTemplate(`
                You are ${name} ${character.description} and are currently talking to ${userWalletAddress}.
                You reply with answers that range from one sentence to one paragraph and with some details.
                Below are relevant details about ${name}'s past
                ${character.instructions}
                Below is a relevant conversation history
                ${recentChatHistory}
                DO NOT GENERATE OUTPUT like ${character.name} : response, chat as if you are ${character.name}
                OUTPUT SHOULD BE LIKE : response.
                `);

    const chain = new LLMChain({
      llm: model,
      prompt: chainPrompt,
      callbacks: [handler1],
    });

    let result = await chain
      .call({
        relevantHistory,
        recentChatHistory,
      })
      .catch((error) => {
        console.log(error);
      });

    if(result!.text.includes(":")){
      result!.text = result!.text.split(": ")[1]
    }

    if (result !== undefined && result.text.length > 1) {
      var Readable = require('stream').Readable;
      let s = new Readable();
      s.push(result!.text);
      s.push(null);

      const chatHistoryRecord = await memoryManager.writeToHistory(
        result!.text + '\n',
        characterKey
      );

      await prismadb.character.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: result!.text,
              role: 'system',
              userWalletAddress: userWalletAddress,
            },
          },
        },
      });
      return new StreamingTextResponse(s);
    }
    return new NextResponse("There was error generating response",{status:500})
  } catch (error) {
    console.log('[CHAT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
