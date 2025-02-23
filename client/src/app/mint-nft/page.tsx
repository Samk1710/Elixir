"use client"

import type React from "react"
import { Droplet,HeartPulse,Syringe,Activity,Users,Ambulance } from "lucide-react"
import { useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Award,
  Hash,
  Wallet,
  LinkIcon,
  BadgeIcon as Certificate,
} from "lucide-react"
import { abi, contract_address } from "@/app/abis/bloodCamp"

const contractAddress = contract_address

const IssueNFTPage = () => {
  const { isConnected } = useAccount()
  const [campId, setCampId] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [uri, setUri] = useState("")
  const [txHash, setTxHash] = useState("")

  const { writeContract, status, error } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = writeContract({
        address: contractAddress,
        abi,
        functionName: "issueNFT",
        args: [campId, recipientAddress, uri],
      })

      if (result) {
        setTxHash(result)
        console.log("Transaction hash:", result)
      }
    } catch (err) {
      console.error("Transaction failed:", err)
    }
  }

  const isLoading = status === "pending"
  const isSuccess = status === "success"
  const isError = status === "error"

  return (
    <div className="container mx-auto max-w-2xl p-4">
       {/* Hero Section */}
       <Droplet className="absolute top-20 left-[15%] h-8 w-8 text-red-700/30 animate-float-slow" />
        <Ambulance className="absolute top-40 right-[20%] h-9 w-9 text-red-500/30 animate-float-slower" />
        <HeartPulse className="absolute bottom-[30%] left-[10%] h-10 w-10 text-red-500/40 animate-float" />
        <Syringe className="absolute top-[60%] right-[15%] h-8 w-8 text-red-500/30 animate-float" />
        <Activity className="absolute bottom-[20%] right-[25%] h-7 w-7 text-red-500/30 animate-float-slower" />
        <Users className="absolute top-[35%] left-[25%] h-9 w-9 text-red-500/30 animate-float" />
      <Card className="backdrop-blur-sm bg-gradient-to-b from-background/80 to-background transition-all duration-300 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Certificate className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <CardTitle>Issue NFT Certificate</CardTitle>
          </div>
          <CardDescription className="text-base">
            Issue a blood donation certificate as an NFT to recognize donor participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <Alert variant="destructive" className="mb-4 animate-in slide-in-from-top-4 duration-300">
              <Wallet className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to issue an NFT</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <Label htmlFor="campId" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Camp ID
                </Label>
                <Input
                  type="number"
                  id="campId"
                  placeholder="Enter camp ID"
                  value={campId}
                  onChange={(e) => setCampId(e.target.value)}
                  required
                  className="w-full transition-all duration-300 hover:shadow-sm focus:shadow-md"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="recipientAddress" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Recipient Address
                </Label>
                <Input
                  type="text"
                  id="recipientAddress"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  required
                  className="w-full font-mono transition-all duration-300 hover:shadow-sm focus:shadow-md"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="uri" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Metadata URI
                </Label>
                <Input
                  type="text"
                  id="uri"
                  placeholder="Enter metadata URI (e.g., ipfs://...)"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  required
                  className="w-full transition-all duration-300 hover:shadow-sm focus:shadow-md"
                />
              </div>

              <Button
                type="submit"
                className="w-full group relative overflow-hidden"
                disabled={isLoading || !isConnected}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Issuing NFT...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 transition-transform group-hover:scale-110" />
                      Issue NFT
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>
          )}

          {isSuccess && txHash && (
            <Alert className="mt-4 animate-in slide-in-from-bottom-4 duration-300 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                NFT issued successfully!{" "}
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-primary inline-flex items-center gap-1 group"
                >
                  View on Etherscan
                  <LinkIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </a>
              </AlertDescription>
            </Alert>
          )}

          {isError && (
            <Alert variant="destructive" className="mt-4 animate-in slide-in-from-bottom-4 duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error?.message || "Failed to issue NFT. Please try again."}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default IssueNFTPage

