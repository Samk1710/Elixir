 "use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { abi, contract_address } from "@/app/abis/organDonation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Search,
  PlusCircle,
  Activity,
  Droplet,
  Hospital,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OrganRequest {
  id: bigint
  recipient: string
  organType: string
  bloodType: string
  urgencyLevel: bigint
  isActive: boolean
  matchedDonor: string
  hospitalId: bigint
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export default function OrganRequests() {
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const [requestId, setRequestId] = useState("")
  const [singleRequest, setSingleRequest] = useState<OrganRequest | null>(null)
  const [donorCheck, setDonorCheck] = useState({ donor: "", organ: "" })
  const [formData, setFormData] = useState({
    hospitalId: "",
    requestId: "",
    organType: "",
    bloodType: "",
    urgencyLevel: "",
    recipient: "",
  })

  const { data: allRequests = [], isLoading: isLoadingRequests } = useReadContract({
    abi,
    address: contract_address,
    functionName: "getAllRequests",
  })

  const { data: isOrganAvailable, isLoading: isCheckingAvailability } = useReadContract({
    abi,
    address: contract_address,
    functionName: "isOrganAvailable",
    args: [donorCheck.donor, donorCheck.organ],
    query: {
      enabled: !!donorCheck.donor && !!donorCheck.organ,
    }
  })

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({
      abi,
      address: contract_address,
      functionName: "createOrganRequest",
      args: [
        BigInt(formData.hospitalId),
        BigInt(formData.requestId),
        formData.organType,
        formData.bloodType,
        BigInt(formData.urgencyLevel),
        formData.recipient,
      ],
    })
  }

  return (
    <div className="container py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Organ Requests</h1>
          <p className="text-muted-foreground">Create and manage organ donation requests</p>
        </div>

        {/* Create Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Request</CardTitle>
            <CardDescription>Submit a new organ donation request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    placeholder="Hospital ID"
                    value={formData.hospitalId}
                    onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Request ID"
                    value={formData.requestId}
                    onChange={(e) => setFormData({ ...formData, requestId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Organ Type"
                    value={formData.organType}
                    onChange={(e) => setFormData({ ...formData, organType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Select onValueChange={(value) => setFormData({ ...formData, bloodType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Urgency Level (1-5)"
                    min="1"
                    max="5"
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Recipient Address"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!address || isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Request...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Request */}
        <Card>
          <CardHeader>
            <CardTitle>Search Request</CardTitle>
            <CardDescription>Look up a specific organ request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input placeholder="Request ID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
              <Button onClick={() => {}}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            {singleRequest && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <span>Organ: {singleRequest.organType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-secondary" />
                        <span>Blood Type: {singleRequest.bloodType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-destructive" />
                        <span>Urgency: {singleRequest.urgencyLevel.toString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* All Requests */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>View all organ donation requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {(allRequests as OrganRequest[])?.map((request) => (
                  <motion.div key={request.id.toString()} variants={item} whileHover={{ scale: 1.02 }}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Request #{request.id.toString()}</span>
                            {request.isActive && (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-primary" />
                              <span>{request.organType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-secondary" />
                              <span>{request.bloodType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-destructive" />
                              <span>Level {request.urgencyLevel.toString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hospital className="h-4 w-4 text-muted-foreground" />
                              <span>Hospital #{request.hospitalId.toString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{request.recipient}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Organ Availability Check */}
        <Card>
          <CardHeader>
            <CardTitle>Check Organ Availability</CardTitle>
            <CardDescription>Verify if a donor has a specific organ available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Donor Address"
                  value={donorCheck.donor}
                  onChange={(e) => setDonorCheck({ ...donorCheck, donor: e.target.value })}
                />
                <Input
                  placeholder="Organ Type"
                  value={donorCheck.organ}
                  onChange={(e) => setDonorCheck({ ...donorCheck, organ: e.target.value })}
                />
              </div>
              {isCheckingAvailability ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking availability...
                </div>
              ) : (
                isOrganAvailable !== undefined && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      isOrganAvailable ? "text-green-500" : "text-destructive",
                    )}
                  >
                    {isOrganAvailable ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Organ is available
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Organ is not available
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

