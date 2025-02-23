"use client"

import type React from "react"
import { useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useQueryClient } from "@tanstack/react-query"
import { abi, contract_address } from "@/app/abis/bloodCamp"
import { useState } from "react"
import type { Hex } from "viem"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const BLOOD_CAMP_ADDRESS = "0x..." as Hex

const BloodType = {
  O_POS: 0,
  O_NEG: 1,
  A_POS: 2,
  A_NEG: 3,
  B_POS: 4,
  B_NEG: 5,
  AB_POS: 6,
  AB_NEG: 7,
} as const

export default function InventoryManager() {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const [selectedCampId, setSelectedCampId] = useState<bigint | null>(null)
  const [bloodType, setBloodType] = useState<number>(0)
  const [quantity, setQuantity] = useState<string>("0")

  const { data: allCamps } = useReadContract({
    address: contract_address,
    abi,
    functionName: "getAllCamps",
  })

  const ownedCamps = (allCamps || []).filter((camp) => camp.owner.toLowerCase() === address?.toLowerCase())

  const { writeContract, isPending, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ['readContract', { functionName: 'getInventory' }]
      })
    }
  }, [isSuccess, queryClient])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCampId) return

    writeContract({
      address: contract_address,
      abi,
      functionName: "updateInventory",
      args: [selectedCampId, bloodType, BigInt(quantity)],
    })
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Camp Inventory</h1>
          <p className="text-muted-foreground mt-2">Manage your blood camp inventory levels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Blood Camps</CardTitle>
            <CardDescription>Select a camp to update its inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ownedCamps.map((camp) => (
                <Card
                  key={camp.id.toString()}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-accent",
                    selectedCampId === camp.id && "border-primary bg-primary/5",
                  )}
                  onClick={() => setSelectedCampId(camp.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{camp.name}</h3>
                        <p className="text-sm text-muted-foreground">{camp.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedCampId && (
          <Card>
            <CardHeader>
              <CardTitle>Update Inventory</CardTitle>
              <CardDescription>Modify blood stock levels for the selected camp</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Type</label>
                    <Select value={bloodType.toString()} onValueChange={(value) => setBloodType(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BloodType)
                          .filter(([key]) => isNaN(Number(key)))
                          .map(([key, value]) => (
                            <SelectItem key={key} value={value.toString()}>
                              {key.replace("_POS", "+").replace("_NEG", "-")}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isPending || isConfirming}>
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Inventory"
                  )}
                </Button>

                {isSuccess && (
                  <div className="flex items-center justify-center text-sm text-green-600 dark:text-green-500">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Inventory updated successfully!
                  </div>
                )}
              </form>

              <CurrentInventoryDisplay campId={selectedCampId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function CurrentInventoryDisplay({ campId }: { campId: bigint }) {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Current Inventory</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(BloodType)
          .filter((value): value is number => typeof value === "number")
          .map((bloodType) => (
            <InventoryItem key={bloodType} campId={campId} bloodType={bloodType} />
          ))}
      </div>
    </div>
  )
}

function InventoryItem({ campId, bloodType }: { campId: bigint; bloodType: number }) {
  const { data: inventory } = useReadContract({
    address: contract_address,
    abi,
    functionName: "getInventory",
    args: [campId, bloodType],
    query: {
      queryKey: ['getInventory', campId.toString(), bloodType]
    }
  })

  const bloodTypeLabel = Object.keys(BloodType)
    .find((key) => BloodType[key as keyof typeof BloodType] === bloodType)
    ?.replace("_POS", "+")
    .replace("_NEG", "-")

  const inventoryValue = Number(inventory) || 0
  const percentage = Math.min(Math.round((inventoryValue / 100) * 100), 100)

  const getInventoryColor = (value: number) => {
    if (value === 0) return "text-gray-400"
    if (value <= 20) return "text-red-500"
    if (value <= 50) return "text-yellow-500"
    return "text-green-500"
  }

  const getFillColor = (value: number) => {
    if (value === 0) return "bg-gray-200"
    if (value <= 20) return "bg-red-500"
    if (value <= 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-12 h-24 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className={`absolute bottom-0 left-0 right-0 ${getFillColor(percentage)} transition-all duration-500`}
              style={{ height: `${percentage}%` }}
            />
          </div>
          <div className="text-center">
            <div className="font-medium text-lg">{bloodTypeLabel}</div>
            <div className={`text-sm ${getInventoryColor(percentage)}`}>{percentage}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}