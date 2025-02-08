"use client"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { signOut } from 'next-auth/react'


export default function Home() {
  const [createRoomId, setCreateRoomId] = useState("")
  const [joinRoomId, setJoinRoomId] = useState("")
  const [joinRoomPassword, setJoinRoomPassword] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()
  // console.log(session?.user.username)
  const username = session?.user.username
  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect("/auth/login")
  }

  const handleCreateRoom = () => {
    // Here you would typically make an API call to create the room
    // For now, we'll just redirect to the code editor page
    router.push(`/code?roomId=${createRoomId}`)
  }

  const handleJoinRoom = () => {
    // Here you would typically make an API call to join the room
    // For now, we'll just redirect to the code editor page
    router.push(`/code?roomId=${joinRoomId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CodeCollab</h1>
          <Button variant="secondary" onClick={()=>{signOut()}}>Logout</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to CodeCollab</h2>
          <p className="text-xl text-muted-foreground">Start collaborating on code in real-time</p>
        </section>

        {/* Create Room Card */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create a Room</CardTitle>
            <CardDescription>Start a new coding session</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Create Room</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Room</DialogTitle>
                  <DialogDescription>Enter a room ID to create a new coding session.</DialogDescription>
                </DialogHeader>
                <Input
                  value={createRoomId}
                  onChange={(e) => setCreateRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                />
                <DialogFooter>
                  <Button onClick={handleCreateRoom}>Create and Join</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>

      {/* Join Meeting Button */}
      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Join Meeting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a Meeting</DialogTitle>
              <DialogDescription>Enter the room ID and password to join an existing session.</DialogDescription>
            </DialogHeader>
            <Input
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="mb-4"
            />
            <Input
              value={joinRoomPassword}
              onChange={(e) => setJoinRoomPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
            />
            <DialogFooter>
              <Button onClick={handleJoinRoom}>Join</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

