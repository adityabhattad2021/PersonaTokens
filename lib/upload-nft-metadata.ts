import { NFTStorage, File } from 'nft.storage';
import fetch from 'node-fetch';

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY;

export async function storeNFT(
  name: string,
  description: string,
  imageUrl: string
) {
  // fetch the image from the URL and convert it to a Blob

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // create a File object from the Blob
  const image = new File([blob], name, { type: blob.type });

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY as string });

  // call client.store, passing in the image & metadata
  return nftstorage.store({
    image,
    name,
    description,
  });
}
