# Quick Installation for PersonaTokens

### Firstly, install dependencies:

```bash
npm install
# or
yarn
```

### Creating the `.env` file:

#### 1. Copy the `.env.example` file to `.env` file.
```bash
cp .env.example .env
```
#### 2. Fill out the missing secrets.

a. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key for the language model.

b. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key for your language model.

c. **Pinecone API key**

Visit https://app.pinecone.io/ to get your Pinecone API key for your language model.

d. **Upstash API key**

Visit https://upstash.com/ to get your Upstash API key for your language model.

e. **Cloudinary API key**

Visit https://cloudinary.com/ to get your Upstash API key for your language model.

f. **MySQL Database URL**
Get your local or cloud MySQL database url

### Run app locally:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).