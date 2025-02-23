"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWriteContract } from "wagmi"
import { abi, contract_address } from "@/app/abis/organDonation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Hospital, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function RegisterHospitalPage() {
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract()
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await writeContract({
      address: contract_address,
      abi,
      functionName: "registerHospital",
      args: [BigInt(id), name, city],
    })

    if (isSuccess) {
      setId("")
      setName("")
      setCity("")
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Register Hospital</h1>
          <p className="text-muted-foreground">Add a new hospital to the organ donation network</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Registration</CardTitle>
            <CardDescription>Fill in the hospital details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hospital ID</label>
                  <Input
                    type="number"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter hospital ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hospital Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter hospital name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    required
                  />
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
                    <Hospital className="mr-2 h-4 w-4" />
                    Register Hospital
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(isSuccess || isError) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className={isSuccess ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  {isSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <p className={isSuccess ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {isSuccess
                      ? "Hospital successfully registered!"
                      : `Error: ${error?.message || "Failed to register hospital"}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

