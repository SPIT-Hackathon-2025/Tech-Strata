import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          {["About", "Blog", "Jobs", "Press", "Privacy", "Terms"].map((item) => (
            <div key={item} className="px-5 py-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                {item}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          &copy; 2023 CodeCollab, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

