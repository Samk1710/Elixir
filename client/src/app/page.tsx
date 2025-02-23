import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Heart, Bell } from "lucide-react"
import { Droplet,HeartPulse,Syringe,Activity,Users,Ambulance } from "lucide-react"
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Hero Section */}
      <Droplet className="absolute top-20 left-[15%] h-8 w-8 text-red-700/30 animate-float-slow" />
        <Ambulance className="absolute top-40 right-[20%] h-9 w-9 text-red-500/30 animate-float-slower" />
        <HeartPulse className="absolute bottom-[30%] left-[10%] h-10 w-10 text-red-500/40 animate-float" />
        <Syringe className="absolute top-[60%] right-[15%] h-8 w-8 text-red-500/30 animate-float" />
        <Activity className="absolute bottom-[20%] right-[25%] h-7 w-7 text-red-500/30 animate-float-slower" />
        <Users className="absolute top-[35%] left-[25%] h-9 w-9 text-red-500/30 animate-float" />
      <section className="min-h-screen flex-1 flex flex-col items-center justify-center space-y-10 px-4 py-24 text-center ">
        <div className="space-y-4 max-w-3xl">
          <h1 className="font-rubik text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-orange-600 via-red-700 to-red-500 bg-clip-text text-transparent bg-[400%] animate-gradient brightness-125 contrast-125">
            Your Blood. Their Lives.
          </h1>
          <h2 className="font-rubik text-sm sm:text-lg md:text-xl font-medium tracking-tight bg-gradient-to-r from-blue-300 via-purple-500 to-blue-300 bg-clip-text text-transparent animate-gradient bg-[300%]">
            Donate Blood. Save Lives. Earn NFTs.
          </h2>

          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Join our community of lifesavers and make a difference while earning unique digital rewards.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg">Join Lifesavers</Button>
          <Button size="lg" variant="outline">
            Emergency Alerts
          </Button>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="container py-24 bg-gradient-to-b from-background to-muted">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Brain className="h-12 w-12 text-secondary" />
                <h3 className="font-rubik text-xl font-bold">AI Health Sync</h3>
                <p className="text-muted-foreground">Instant eligibility checks powered by advanced AI technology.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="font-rubik text-xl font-bold">NFT Lifedrops</h3>
                <p className="text-muted-foreground">Earn unique digital rewards for your lifesaving contributions.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Bell className="h-12 w-12 text-secondary" />
                <h3 className="font-rubik text-xl font-bold">Live Alerts</h3>
                <p className="text-muted-foreground">
                  Real-time emergency notifications when blood is needed urgently.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
