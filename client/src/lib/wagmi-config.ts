'use client'

import { mainnet,baseSepolia, sepolia, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'

export const config = createConfig({
  chains: [baseSepolia, mainnet, sepolia,polygon, optimism, arbitrum, base],
  transports: {
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
      },
    ssr: true
})