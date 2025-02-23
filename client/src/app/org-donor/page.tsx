"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useReadContract, useWriteContract, useAccount } from "wagmi"
import { abi, contract_address } from "@/app/abis/organDonation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart, User, FileText, Hospital, Loader2, CheckCircle2 } from "lucide-react"

interface Hospital {
  id: string
  name: string
  address: string
}

interface Donor {
  organs: string[]
  nextOfKin: string
  isActive: boolean
  nextOfKinApproval: boolean
  ipfsHealthRecords: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function OrganDonation() {
  const { address } = useAccount()
  const [donorAddress, setDonorAddress] = useState("")
  const [organsInput, setOrgansInput] = useState("")
  const [nextOfKin, setNextOfKin] = useState("")
  const [ipfsHash, setIpfsHash] = useState("")

  const { writeContract, isPending } = useWriteContract()

  const { data: hospitals, isLoading: isHospitalsLoading } = useReadContract({
    abi,
    address: contract_address,
    functionName: "getAllHospitals",
  })

  const { data: donorData, isLoading: isDonorLoading } = useReadContract({
    abi,
    address: contract_address,
    functionName: "getDonor",
    args: [donorAddress],
    enabled: !!donorAddress,
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const organs = organsInput
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o)

    writeContract({
      abi,
      address: contract_address,
      functionName: "registerDonor",
      args: [organs, nextOfKin, ipfsHash],
    })
  }

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({
      abi,
      address: contract_address,
      functionName: "approveAsDonor",
      args: [donorAddress],
    })
  }

  return (
    <div className="container py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Organ Donation</h1>
          <p className="text-muted-foreground">Register as an organ donor and manage your donations</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Registration</CardTitle>
            <CardDescription>Register yourself as an organ donor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Organs</label>
                  <Input
                    value={organsInput}
                    onChange={(e) => setOrgansInput(e.target.value)}
                    placeholder="Heart, Liver, Kidney"
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple organs with commas</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Next of Kin Address</label>
                  <Input value={nextOfKin} onChange={(e) => setNextOfKin(e.target.value)} placeholder="0x..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">IPFS Health Records</label>
                  <Input value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} placeholder="QmHash..." />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Register as Donor
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Donor Details */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Details</CardTitle>
            <CardDescription>View donor information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  placeholder="Enter donor address"
                />
                <Button onClick={handleApprove} disabled={!donorAddress}>
                  Approve Donor
                </Button>
              </div>

              {isDonorLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {donorData ? <>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          <span>Organs: {(donorData as Donor).organs?.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-secondary" />
                          <span>Next of Kin: {(donorData as Donor).nextOfKin}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>IPFS Records: {(donorData as Donor).ipfsHealthRecords}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Status: {(donorData as Donor).isActive ? "Active" : "Inactive"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              
              </>:<>
              </>
                
              }
            </div>
          </CardContent>
        </Card>

        {/* Hospitals List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Hospitals</CardTitle>
            <CardDescription>View all participating hospitals</CardDescription>
          </CardHeader>
          <CardContent>
            {isHospitalsLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(hospitals as Hospital[])?.map((hospital) => (
                  <motion.div key={hospital.id} whileHover={{ scale: 1.02 }}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hospital className="h-4 w-4 text-primary" />
                            <span className="font-medium">{hospital.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{hospital.address}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

