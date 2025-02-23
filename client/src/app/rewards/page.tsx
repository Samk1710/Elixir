"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Gift } from "lucide-react"

export default function RewardsPage() {
  return (
    <div className="container py-10">
      <div className="space-y-8">
        {/* NFT Gallery */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Your NFT Collection</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {["Plasma Pioneer", "Golden Vein", "Lifesaver Elite", "Blood Hero"].map((nft, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-primary" />
                  </div>
                  <div className="text-center mt-4 space-y-2">
                    <h3 className="font-semibold text-lg">{nft}</h3>
                    <p className="text-sm text-muted-foreground">Earned for your {i + 1}th donation</p>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Available Rewards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Amazon Voucher",
                description: "₹500 shopping voucher",
                cost: "2 NFTs",
              },
              {
                name: "Zomato Pro",
                description: "1 month subscription",
                cost: "1 NFT",
              },
              {
                name: "Health Checkup",
                description: "Free basic health screening",
                cost: "3 NFTs",
              },
            ].map((reward, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <span>{reward.name}</span>
                  </CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cost: {reward.cost}</span>
                    <Button>Redeem</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        
      </div>
    </div>
  )
}

