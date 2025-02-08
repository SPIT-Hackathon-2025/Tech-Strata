import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary scroll-smooth">
              CodeCollab
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary scroll-smooth-down"
            >
              Features
            </Link>
            <Link
              href="#collaboration"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Collaboration
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div>
            <Link href={"/auth/login"}>
              <Button variant="outline" className="mr-2">
                Log in
              </Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
