"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Collaboration() {
  const [code, setCode] = useState(
    `function greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("CodeCollab user");`,
  )

  return (
    <section id="collaboration" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Collaboration</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Code together, in real-time</p>
        </div>
        <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 flex justify-between items-center bg-muted">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
            <div className="text-muted-foreground text-sm">script.js</div>
          </div>
          <div className="p-4">
            <pre className="text-sm">
              <code>{code}</code>
            </pre>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={() => setCode(code + "\n// New line added by collaborator")}>
            Simulate Collaboration
          </Button>
        </div>
      </div>
    </section>
  )
}

