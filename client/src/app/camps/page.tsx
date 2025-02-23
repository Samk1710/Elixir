"use client"
import { Button } from "@/components/ui/button"

import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"
import { useReadContract } from 'wagmi' // Updated import
import { abi, contract_address } from '@/app/abis/bloodCamp'
import { useGeolocation } from "@/components/hooks/useGeolocation"
import calculateDistance from "@/lib/calculateDistance"
const Map = dynamic(() => import("@/components/utils/map"), { ssr: false })

export default function CampsPage() {
  

 

  const { data: camps, isError, isLoading } = useReadContract({
    address: contract_address,
    abi,
    functionName: 'getAllCamps',
  }) as { 
    data: Array<{
      id: string;
      name: string;
      city: string;
      organizer: string;
      lat: number;
      long: number;
    }>;
    isError: boolean;
    isLoading: boolean;
  };
  const { location } = useGeolocation();

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Filters */}
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
                    <p className="text-sm text-muted-foreground">Located at: {location?.latitude && location?.longitude && camp?.lat && camp?.long ? calculateDistance(location.latitude, location.longitude, camp.lat, camp.long).toFixed() : 'N/A'} Km</p>
                   
                  </div>
                </div>
                <Button>Book Slot</Button>
              </div>
            ))}
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
          
        </div>
      </div>
    </div>
  )
}