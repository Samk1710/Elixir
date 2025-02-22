"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropletIcon, Calendar, Trophy, AlertTriangle, Upload, Copy, Bell } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useReadContract } from 'wagmi';
import { abi, contract_address } from '@/app/abis/user'; // Adjust the path to your contract ABI and address
import { useState, useEffect } from "react"

const healthData = [
  { month: "Jan", hemoglobin: 14.2 },
  { month: "Feb", hemoglobin: 13.8 },
  { month: "Mar", hemoglobin: 14.5 },
  { month: "Apr", hemoglobin: 14.0 },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function UserDashboard() {
  const { data: userData, isError, isLoading } = useReadContract({
    address: contract_address,
    abi,
    functionName: 'getUser ',

  });
useEffect(() => {
  console.log(userData);
  }
)
  return (
    <div className="container py-10">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Profile Summary */}
        <motion.div variants={item} className="grid gap-4 md:grid-cols-[300px_1fr]">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <DropletIcon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium bg-secondary text-white">
                    O+ Hero
                  </span>
                </div>
                <div className="text-center">
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : isError ? (
                    <p>Error loading user data</p>
                  ) : (
                    <>
                      <h2 className="font-semibold">{userData[0]}</h2>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{userData[1]}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Stats</CardTitle>
              <CardDescription>Your donation eligibility and health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hemoglobin" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Schedule Donation",
                icon: Calendar,
                color: "text-secondary",
              },
              {
                title: "Upload Report",
                icon: Upload,
                color: "text-primary",
              },
              {
                title: "Emergency Alerts",
                icon: AlertTriangle,
                color: "text-destructive",
              },
              {
                title: "NFT Gallery",
                icon: Trophy,
                color: "text-secondary",
              },
            ].map((action, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card className="backdrop-blur-sm bg-card/80">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <action.icon className={`h-8 w-8 ${action.color}`} />
                      <span className="font-medium">{action.title}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Donation History & Notifications */}
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Your blood donation journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <DropletIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Donated at Mumbai Camp</p>
                        <p className="text-sm text-muted-foreground">Aug 2023</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                            Hemoglobin: 14.2 g/dL ✅
                          </span>
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            NFT #45 Minted
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with latest alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="bg-secondary/10">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <Bell className="h-4 w-4 text-secondary mt-1" />
                        <div>
                          <p className="font-medium">New Camp Nearby</p>
                          <p className="text-sm text-muted-foreground">A+ blood type needed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-destructive/10">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-1" />
                        <div>
                          <p className="font-medium">Emergency Alert</p>
                          <p className="text-sm text-destructive">B- Required in Delhi</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* NFT Rewards */}
        
      </motion.div>
    </div>
  )
}