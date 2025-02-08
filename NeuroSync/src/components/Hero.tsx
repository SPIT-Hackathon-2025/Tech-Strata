import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">Collaborate on Code in Real-Time</h1>
          <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
            CodeCollab brings teams together with a powerful, collaborative online IDE.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {/* <Button size="lg" variant="secondary">
              Get Started
            </Button>
            <Button  size="lg" variant="secondary">
              
              Learn More
            </Button> */}
            <Link href={"/auth/register"} className="btn font-semibold bg-white text-black rounded-lg p-2 btn-primary">
              Get Started
            </Link>
            <Link href="#features" className="btn font-semibold bg-white text-black rounded-lg p-2 btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

