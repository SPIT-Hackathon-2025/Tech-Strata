"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import showToast from "@/components/showToast/showToast" // Updated import path
import { useSession } from "next-auth/react"
import axios from "axios"
export default function Register() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

   const { data: session, status } = useSession()
  
    useEffect(() => {
      if (status === "authenticated") {
        router.push("/dashboard")
      }
    }, [status, router])
  
    if (status === "loading") {
      return <div>Loading...</div>
    }
  
    if (status === "authenticated") {
      return null
    }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const res = await axios.post("/api/users/signUp", {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        email: formData.get("email") as string
      })
      console.log("first")
      console.log(res)
      if (res.data.status != 200) {
        showToast("Please enter a valid email address.", "error");
        throw new Error(await res.data.message)
      }
      router.replace("/auth/login")
    } catch (error: any) {
      showToast("Please enter a valid email address.", "error");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}