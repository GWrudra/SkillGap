import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { RoleTicker } from "@/components/landing/role-ticker"
import { Method } from "@/components/landing/method"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <RoleTicker />
      <Method />
      <HowItWorks />
      <CTA />
      <Footer />
      <ServiceWorkerRegistration />
    </main>
  )
}
