import { Code, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    name: "Powerful IDE",
    description: "Full-featured code editor with syntax highlighting and intelligent code completion.",
    icon: Code,
  },
  {
    name: "Real-Time Collaboration",
    description: "Work together in real-time with team members, just like in a Google Doc.",
    icon: Users,
  },
  {
    name: "Instant Deployment",
    description: "Deploy your projects with a single click and share them with the world.",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to code collaboratively
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.name}>
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

