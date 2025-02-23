"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropletIcon, Calendar, Bell, Award, ChevronRight, MapPin, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-red-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Every Drop of Blood
                    <span className="text-red-500"> Saves</span> a Life
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Join our community of lifesavers. Donate blood, earn unique NFT rewards, and make a real difference
                    in your community.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-red-500 hover:bg-red-600" size="lg" onClick={() => alert("Find camps")}>
                    Find Nearby Camps
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => alert("Register camp")}>
                    Register Blood Camp
                  </Button>
                </div>
              </div>
              <img
                src="https://images.onlymyhealth.com/imported/images/2024/June/14_Jun_2024/mn-donor.jpg"
                alt="Blood Donation"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Making Blood Donation
                  <span className="text-red-500"> Simple</span>
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform connects donors with blood camps and hospitals, making the process seamless and
                  rewarding.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="relative overflow-hidden p-6 group hover:shadow-lg transition-all">
                <Calendar className="h-12 w-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Easy Scheduling</h3>
                <p className="text-gray-500">
                  Find and schedule donations at nearby blood camps with just a few clicks.
                </p>
              </Card>
              <Card className="relative overflow-hidden p-6 group hover:shadow-lg transition-all">
                <Award className="h-12 w-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">NFT Rewards</h3>
                <p className="text-gray-500">
                  Earn unique NFTs for each donation, building your digital collection of impact.
                </p>
              </Card>
              <Card className="relative overflow-hidden p-6 group hover:shadow-lg transition-all">
                <Bell className="h-12 w-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Emergency Alerts</h3>
                <p className="text-gray-500">
                  Get notified instantly when there's an urgent need for blood in your area.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-red-50" id="impact">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Community Impact</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Together, we're creating a sustainable ecosystem of blood donation that saves lives every day.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-red-500">50K+</h3>
                    <p className="text-sm text-gray-500">Active Donors</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-red-500">100K+</h3>
                    <p className="text-sm text-gray-500">Lives Saved</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-red-500">1K+</h3>
                    <p className="text-sm text-gray-500">Partner Hospitals</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-red-500">5K+</h3>
                    <p className="text-sm text-gray-500">NFTs Awarded</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 lg:order-last">
                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-12 w-12 text-red-500" />
                    <div>
                      <h3 className="text-xl font-bold">Verified Partners</h3>
                      <p className="text-gray-500">All our partner hospitals and blood banks are thoroughly verified</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-12 w-12 text-red-500" />
                    <div>
                      <h3 className="text-xl font-bold">Wide Coverage</h3>
                      <p className="text-gray-500">Available across multiple cities with growing network</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Save Lives?</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our community of lifesavers today and make a real difference in someone's life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-red-500 hover:bg-red-600" size="lg" onClick={() => alert("Join now")}>
                  Join Lifesavers
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => alert("Learn more")}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 px-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <DropletIcon className="h-6 w-6 text-red-500" />
                <span className="text-xl font-bold">Elixir</span>
              </Link>
              <p className="max-w-[350px] text-gray-500">
                Making blood donation accessible, rewarding, and impactful through blockchain technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-bold">Platform</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Find Camps
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Register Camp
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Emergency Alerts
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t py-6 text-center text-gray-500">
            © {new Date().getFullYear()} Elixir. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}