/**
 * Configuration object for the application
 * @type AppConfig
 */
export type AppConfig = {
  /** Chain ID of the blockchain network */
  chainId: string;
  /** Smart contract address of the NFT collection */
  contractAddress: string;
  /** Moralis API key for blockchain interactions */
  moralisApiKey: string;
  /** Base IPFS URI for NFT content */
  baseIpfsUri: string;
  /** Total number of NFTs in the collection */
  totalNfts: number;
  /** Directory path for storing downloaded content */
  dirPath: string;
};

/**
 * Metadata structure for NFT tokens
 * @type NFTMetadata
 */
export type NFTMetadata = {
  /** Display name of the NFT */
  name: string;
  /** Description of the NFT */
  description: string;
  /** IPFS URL of the NFT's image/video */
  image: string;
  /** Array of NFT attributes/traits */
  attributes: any[];
};

/**
 * Results of the NFT download process
 * @type DownloadResults
 */
export type DownloadResults = {
  /** Successfully downloaded NFTs */
  successful: Array<{
    tokenId: number;
    uri: string;
  }>;
  /** Failed download attempts */
  failed: Array<{
    tokenId: number;
    error: string;
    uri: string;
  }>;
  /** NFTs that were skipped (already downloaded) */
  skipped: Array<{
    tokenId: number;
  }>;
  /** NFTs without metadata */
  noMetadata: Array<{
    tokenId: number;
    uri: string;
  }>;
  /** Token IDs of NFTs without images */
  noImage: number[];
  /** Statistical summary of the download process */
  stats: {
    /** Total number of NFTs in collection */
    totalNFTs: number;
    /** Number of NFTs processed */
    processed: number;
    /** Number of NFTs successfully downloaded */
    downloaded: number;
    /** Number of NFTs skipped */
    skipped: number;
    /** Number of failed downloads */
    failed: number;
    /** Number of NFTs without metadata */
    noMetadata: number;
    /** Number of NFTs without images */
    noImage: number;
  };
};
