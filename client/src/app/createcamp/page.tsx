"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWriteContract, useAccount, useChainId, useSwitchChain } from "wagmi"
import { abi, contract_address } from "@/app/abis/bloodCamp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, User, MapIcon as City, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import axios from "axios"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function CreateCampPage() {
  const { address, isConnected } = useAccount()
  const [id, setId] = useState<number>(0)
  const [name, setName] = useState<string>("")
  const [organizer, setOrganizer] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const { writeContract, isPending, isSuccess, isError } = useWriteContract()
  
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (id > 0 && name && organizer && city && latitude !== null && longitude !== null) {
      writeContract({
        address: contract_address,
        abi,
        functionName: "createCamp",
        args: [id, name, organizer, city, latitude.toString(), longitude.toString()], // Pass latitude and longitude as strings
      })
    }
  }

  const handleSwitchChain = () => {
    switchChain({ chainId: 84532 })
  }

  const getLocation = useCallback(() => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location: ", error)
          setIsLocating(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLocating(false)
    }
  }, [])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  return (
    <div className="container max-w-2xl py-10">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Blood Camp</h1>
          <p className="text-muted-foreground">Register a new blood donation camp and provide its location details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Camp Details</CardTitle>
            <CardDescription>Fill in the required information to create a new blood donation camp</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
                className="space-y-4"
              >
                <motion.div variants={fadeIn}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="id">Camp ID</Label>
                  </div>
                  <Input
                    id="id"
                    type="number"
                    value={id}
                    onChange={(e) => setId(Number(e.target.value))}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </motion.div>

                <motion.div variants={fadeIn}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="name">Camp Name</Label>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </motion.div>

                <motion.div variants={fadeIn}>
                  <div className="flex items-center space-x-2 mb-2">
                    <User  className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="organizer">Organizer</Label>
                  </div>
                  <Input
                    id="organizer"
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </motion.div>

                <motion.div variants={fadeIn}>
                  <div className="flex items-center space-x-2 mb-2">
                    <City className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="city">Venue</Label>
                  </div>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Label>Location Coordinates</Label>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={getLocation} disabled={isLocating}>
                      {isLocating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting location...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Get Current Location
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        value={latitude !== null ? latitude : ""}
                        onChange={(e) => setLatitude(Number(e.target.value))}
                        className="transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        value={longitude !== null ? longitude : ""}
                        onChange={(e) => setLongitude(Number(e.target.value))}
                        className="transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className="pt-4">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Camp...
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-4 w-4" />
                        Create Camp
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
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
                    {isSuccess ? "Camp created successfully!" : "Error creating camp. Please try again."}
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