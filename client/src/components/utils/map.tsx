import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Location {
  latitude: number
  longitude: number
}

interface MapLocation {
  latitude: number
  longitude: number
  name?: string
}

interface MapProps {
  nearbyCamps?: MapLocation[]
}

// Custom marker icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484185.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [38, 38],
  iconAnchor: [12, 48],
  popupAnchor: [1, -34],
  shadowSize: [54, 38],
})

const locationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function Map({ nearbyCamps = [] }: MapProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false)
      },
      () => {
        setError("Unable to retrieve your location")
        setLoading(false)
      },
    )
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <div className="text-lg">Loading map...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <div className="text-lg text-destructive">{error}</div>
      </div>
    )
  }

  if (!userLocation) return null

  // Filter out any camps with invalid coordinates
  

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={12.9}
        maxZoom={24}
        minZoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "inherit", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/streets-v2-light/256/{z}/{x}/{y}.png?key=GX8ZuDo9kiizn4B8zLLZ"
        />

        {/* User location marker */}
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>
            <div className="font-semibold">Your Location</div>
          </Popup>
        </Marker>

        {/* Other location markers */}
        {nearbyCamps.map((location, index) => (
          <Marker
            key={`${location.location?.latitude}-${location.location?.longitude}-${index}`}
            position={[location?.location?.latitude, location?.location?.longitude]}
            icon={locationIcon}
          >
            <Popup>
              <div>
                {location.name ? (
                  <div className="font-semibold mb-1">{location.name}</div>
                ) : (
                  <div>Location {index + 1}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}