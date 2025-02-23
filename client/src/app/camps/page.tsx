"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Switch } from "@/components/ui/switch"
import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"
import { useReadContract } from 'wagmi' // Updated import
import { abi, contract_address } from '@/app/abis/bloodCamp'
import { useGeolocation } from "@/components/hooks/useGeolocation"
import calculateDistance from "@/lib/calculateDistance"
const Map = dynamic(() => import("@/components/utils/map"), { ssr: false })

export default function CampsPage() {
  // interface BloodType {
  //   O_POS: "O_POS",
  //   O_NEG: "O_NEG",
  //   A_POS: "A_POS",
  //   A_NEG: "A_NEG",
  //   B_POS: "B_POS",
  //   B_NEG: "B_NEG",
  //   AB_POS: "AB_POS",
  //   AB_NEG: "AB_NEG",
  // }

  // interface Camp {
  //   id: number;
  //   name: string;
  //   organizer: string;
  //   city: string;
  //   owner: string;
  // }

 

  // Updated contract read hook
  const { data: camps, isError, isLoading } = useReadContract({
    address: contract_address,
    abi,
    functionName: 'getAllCamps',
    // Optional parameters if needed:
    // args: [],
    // chainId: 84532, // Base Sepolia
  })
  const { location,  error } = useGeolocation();

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Filters */}
        <div className="space-y-6">
          {/* <div className="space-y-2">
            <h2 className="text-lg font-semibold">Blood Type</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a_pos">A+</SelectItem>
                <SelectItem value="a_neg">A-</SelectItem>
                <SelectItem value="b_pos">B+</SelectItem>
                <SelectItem value="b_neg">B-</SelectItem>
                <SelectItem value="o_pos">O+</SelectItem>
                <SelectItem value="o_neg">O-</SelectItem>
                <SelectItem value="ab_pos">AB+</SelectItem>
                <SelectItem value="ab_neg">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* <div className="space-y-2">
            <h2 className="text-lg font-semibold">Age Range</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Minimum Age: 18</Label>
                <Slider defaultValue={[18]} max={100} min={18} step={1} />
              </div>
              <div className="space-y-1">
                <Label>Maximum Age: 65</Label>
                <Slider defaultValue={[65]} max={100} min={18} step={1} />
              </div>
            </div>
          </div> */}

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Distance</h2>
            <Input type="number" placeholder="Distance in km" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Optimize Route</h2>
            <div className="flex items-center space-x-2">
              <Switch id="optimize" />
              <Label htmlFor="optimize">Enable route optimization</Label>
            </div>
          </div>

          <Button className="w-full">Apply Filters</Button>
        </div>

        {/* Map and Camps List */}
        <div className="space-y-6">
          {/* Map */}
          <div className="aspect-video rounded-lg border bg-muted">
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              <Map camps={camps}/>
            </div>
          </div>

          {/* Camps List */}
          <div className="grid gap-4">
            {isLoading && <div>Loading camps...</div>}
            {isError && <div>Error loading camps</div>}
            {camps?.map((camp) => (
              <div key={camp.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{camp.name}</h3>
                    <p className="text-sm text-muted-foreground">{camp.city}</p>
                    <p className="text-sm text-muted-foreground">Organized by: {camp.organizer}</p>
                    <p className="text-sm text-muted-foreground">Located at: {calculateDistance(location?.latitude,location?.longitude,camp?.lat,camp?.long).toFixed()} Km</p>
                   
                  </div>
                </div>
                <Button>Book Slot</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}