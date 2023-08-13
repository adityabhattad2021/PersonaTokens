# PersonaTokens

## Overview
- [PersonaTokens](#personatokens-1)
  - [How It Works](#how-it-works)
    - [Onboarding and Character Creation](#onboarding-and-character-creation)
    - [Conversations with AI Characters](#conversations-with-ai-characters)
    - [NFT Marketplace](#nft-marketplace)
  - [Live Site Link](#dApp-is-live-at)
  - [Installation Guide](https://github.com/adityabhattad2021/PersonaTokens/blob/main/INSTALLATION.md)
  - [Repository for Smart Contracts](https://github.com/adityabhattad2021/PersonaTokens-Smart-Contracts/)

# PersonaTokens

Personatokens.ai is an AI character NFT marketplace that leverages Langchain, Pinecone, Upstash, Vercel's AI SDK, and OpenAI's GPT APIs to generate AI characters with memory. These characters can be minted and traded as NFTs on the blockchain. Once an NFT is minted, users can engage in conversations with the AI character. As the character accumulates more conversations, the data becomes context for subsequent interactions, resulting in higher quality conversations.


## How It Works

### Onboarding and Character Creation

Users are onboarded to the marketplace by connecting their Web3 wallets, such as Metamask or Coinbase wallet, to the dApp. Once connected, the dApp identifies users through their wallet addresses. To create their Character NFT, users provide essential details about the character:

- **Character Name:** This acts as the primary identifier for the Character NFT.
- **Character Description:** A concise description outlining the character's traits.
- **Character Backstory:** Users can craft a backstory for the character, tailoring it to their preferences.
- **Character Sample Conversation:** A provided conversation sample establishes the character's conversational tone after minting.

With these details in place, users can proceed to create their character. Clicking the "Create Character" button triggers an automatic NFT minting process for the character. The NFT's metadata includes the character's name, description, and image, while other data is stored in the Planetscale database.

### Conversations with AI Characters

It uses Langchain to use the stored character backstory and sample conversations as context during interactions. As users engage in conversations, the AI character's responses are stored in a Redis database and indexed in the Pinecone vector database. For subsequent conversations, the platform performs a similarity search within the Pinecone DB using OpenAI Embeddings. If similar conversations are identified, the corresponding dialogue is retrieved from the Redis DB and is then used as context for the next conversation. 

### NFT Marketplace

The NFT marketplace, currently deployed on the Base Goerli Testnet (It also supports Optimism and Zora testnets), enables users to list their AI characters for sale. Other users can purchase these listed NFTs, interact with the characters, and subsequently sell them. This creates a dynamic cycle within the marketplace, where characters evolve with each interaction, increasing their value and demand over time.

## dApp is live at

Explore the project on [personatokens.ai](https://persona-tokens.vercel.app/).

## [Smart Contracts](https://github.com/adityabhattad2021/PersonaTokens-Smart-Contracts/)

### Optimism:
    - personaToken address: 0x92375B06FA35D3992F7169d47762fec313600203
    - NFTMarketplace address: 0x209e263B2F32371328DCCDAb23Ea03edBF638Bf1
### Base goerli 
    - personaToken address: 0x23963D16d28890c0C70f051c297037a26605E39a
    - NFTMarketplace address: to0xee8De8ba629F69f75a648b6934016f8B43131441
### Zora Test
    - personaToken address: 0x04e57B3DFb3A282B73a08498f60a73A75FFDb71e
    - NFTMarketplace address: 0x92375B06FA35D3992F7169d47762fec313600203
