"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { BrowserMultiFormatReader } from "@zxing/library"
import { QRCodeSVG } from "qrcode.react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Wallet, Copy, QrCode, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function WalletScanner() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [scanResult, setScanResult] = useState<string>("")
  const [cameraError, setCameraError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [copied, setCopied] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReader = useRef(new BrowserMultiFormatReader())

  useEffect(() => {
    return () => {
      codeReader.current.reset()
    }
  }, [])

  const startScan = async () => {
    setIsScanning(true)
    setCameraError("")

    try {
      if (typeof window !== "undefined") {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        const result = await codeReader.current.decodeFromVideoElement(videoRef.current!)
        if (result) {
          setScanResult(result.getText())
          validateWalletAddress(result.getText())
        }
      }
    } catch (error) {
      setCameraError("Error accessing camera or scanning QR code")
    } finally {
      setIsScanning(false)
    }
  }

  const validateWalletAddress = (address: string) => {
    if (ethers.isAddress(address)) {
      setWalletAddress(address)
    } else {
      setCameraError("Invalid Ethereum address")
    }
  }

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      setWalletAddress(accounts[0])
    } catch (error) {
      setCameraError("Failed to connect MetaMask")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy address")
    }
  }

  return (
    <div className="container py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Wallet Scanner</h1>
          <p className="text-muted-foreground">Scan and validate Ethereum wallet addresses</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scanner</CardTitle>
              <CardDescription>Scan a wallet address QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video rounded-lg border bg-muted">
                <video ref={videoRef} className="absolute inset-0 h-full w-full rounded-lg object-cover" />
              </div>

              <Button onClick={startScan} className="w-full" disabled={isScanning}>
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanning
                  </>
                )}
              </Button>

              {cameraError && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {cameraError}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Display Section */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>Connected wallet information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {walletAddress ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex justify-center">
                    <QRCodeSVG value={walletAddress} size={200} level="H" className="rounded-lg" />
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Address</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                          {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="mt-2 break-all text-sm text-muted-foreground">{walletAddress}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Button onClick={connectMetaMask} className="w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {scanResult && !walletAddress && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Scanned Result: {scanResult}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

