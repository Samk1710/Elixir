"use client"
import { useState } from 'react'; // Import useState
import { useReadContracts } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, Trophy } from "lucide-react"
import { abi, contract_address } from '@/app/abis/bloodCamp'

const donationData = [
  { month: "Jan", donations: 65 },
  { month: "Feb", donations: 59 },
  { month: "Mar", donations: 80 },
  { month: "Apr", donations: 81 },
  { month: "May", donations: 56 },
  { month: "Jun", donations: 55 },
]

const BLOOD_TYPES = [
  { type: "O+", enum: 0 },
  { type: "O-", enum: 1 },
  { type: "A+", enum: 2 },
  { type: "A-", enum: 3 },
  { type: "B+", enum: 4 },
  { type: "B-", enum: 5 },
  { type: "AB+", enum: 6 },
  { type: "AB-", enum: 7 },
]

export default function HospitalDashboard() {
  const [campId, setCampId] = useState('0123'); // State for campId
const [camp, setCamp] = useState('0123'); // State for campId
  // Fetch all blood type inventories in a single multicall
  const { data, isLoading, isError } = useReadContracts({
    contracts: BLOOD_TYPES.map(bt => ({
      address: contract_address,
      abi,
      functionName: 'getInventory',
      args: [BigInt(camp), bt.enum],
    })),
  })

  // Process inventory data
  const bloodStock = BLOOD_TYPES.map((bt, index) => {
    const result = data?.[index]?.result
    const level = result ? Number(result) : 0
    
    let status: "critical" | "low" | "normal" = "normal"
    if (level <= 20) status = "critical"
    else if (level <= 50) status = "low"

    return { 
      type: bt.type,
      level,
      status
    }
  })

  if (isLoading) return <div className="container py-10">Loading inventory...</div>
  if (isError) return <div className="container py-10">Error loading inventory</div>

  return (
    <div className="container py-10">
      {/* Camp ID Input */}
      <div className="mb-4">
        <input
          type="text"
          value={campId}
          onChange={(e) => setCampId(e.target.value)} // Update campId state
          placeholder="Enter Camp ID"
          className="border rounded p-2"
        />
        <Button className='ml-4' onClick={() => {setCamp(campId)}}>
          Fetch Inventory
        </Button>
      </div>

      {/* Emergency Broadcast */}
      <Card className="mb-8 bg-destructive/5 border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Emergency Blood Required</h3>
                <p className="text-sm text-muted-foreground">Broadcast alert to nearby donors</p>
              </div>
            </div>
            <Button variant="destructive">Send SOS</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8">
        {/* Blood Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Inventory</CardTitle>
            <CardDescription>Current blood stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {bloodStock.map((stock) => (
                <Card key={stock.type}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative w-20 h-32">
                        <div
                          className="absolute inset-x-0 bottom-0 bg-muted rounded-lg w-full"
                          style={{ height: "100%" }}
                        >
                          <div
                            className={`absolute inset-x-0 bottom-0 rounded-lg transition-all duration-500 ${
                              stock.status === "critical"
                                ? "bg-destructive"
                                : stock.status === "low"
                                  ? "bg-yellow-500"
                                  : "bg-primary"
                            }`}
                            style={{ height: `${stock.level}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold">{stock.type}</h4>
                        <p
                          className={`text-sm ${
                            stock.status === "critical"
                              ? "text-destructive"
                              : stock.status === "low"
                                ? "text-yellow-500"
                                : "text-primary"
                          }`}
                        >
                          {stock.level}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Donations</CardTitle>
              <CardDescription>Number of donations per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="donations" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Lifesavers</CardTitle>
              <CardDescription>Most active donors this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Alex Johnson", donations: 5 },
                  { name: "Sarah Smith", donations: 4 },
                  { name: "Mike Brown", donations: 3 },
                ].map((donor, i) => (
                  <div key={i} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Trophy
                        className={`h-4 w-4 ${
                          i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-600"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-muted-foreground">{donor.donations} donations</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}