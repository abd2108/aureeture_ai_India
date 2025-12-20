import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <section className="container mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <p className="mt-3 text-lg text-muted-foreground">We couldn’t find the page you’re looking for.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/">
            <Button className="rounded-full">Go back home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="rounded-full">Contact support</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
