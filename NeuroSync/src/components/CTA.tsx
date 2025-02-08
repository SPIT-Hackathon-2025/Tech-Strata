import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="bg-primary">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block opacity-75">Start your free trial today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <Button size="lg" variant="secondary">
            Get started
          </Button>
        </div>
      </div>
    </section>
  )
}

