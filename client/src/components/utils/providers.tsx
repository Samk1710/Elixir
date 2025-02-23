'use client'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import {config} from '@/lib/wagmi-config'

// const config = getDefaultConfig({
//   appName: 'Elixir',
//   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '7fca28a51fc7faf46402c981989c35d0',
//   chains: [mainnet, polygon, optimism, arbitrum, base],
//   ssr: true,
// })

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}