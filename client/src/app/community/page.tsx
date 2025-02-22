"use client"
import { Award, Heart, MessageSquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const donationData = [
  { day: "Mon", donations: 120 },
  { day: "Tue", donations: 150 },
  { day: "Wed", donations: 180 },
  { day: "Thu", donations: 140 },
  { day: "Fri", donations: 160 },
  { day: "Sat", donations: 200 },
  { day: "Sun", donations: 170 },
]

export default function CommunityPage() {
  const challenges = [
    {
      title: "Donate to Charity X",
      description: "Help us reach our goal of $10,000!",
      progress: 75,
    },
    {
      title: "Volunteer at Event Y",
      description: "Join us for a day of volunteering!",
      progress: 30,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Blood Donation Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Donation Statistics</CardTitle>
            <CardDescription>Daily donations across the country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="donations" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
              <CardDescription>Complete challenges to earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {challenges.map((challenge, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <div>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${challenge.progress}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Forum Feed */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>Share your experiences and tips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input placeholder="Start a discussion..." />
                <Button>Post</Button>
              </div>

              {/* Forum Posts */}
              {[
                {
                  title: "My First NFT Experience",
                  author: "John Doe",
                  content: "Just earned my first Lifesaver NFT! The process was amazing...",
                  likes: 24,
                  comments: 12,
                },
                {
                  title: "Tips for First-time Donors",
                  author: "Sarah Smith",
                  content: "Here are some helpful tips that helped me with my first donation...",
                  likes: 45,
                  comments: 18,
                },
              ].map((post, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">Posted by {post.author}</p>
                      </div>
                      <p className="text-sm">{post.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

