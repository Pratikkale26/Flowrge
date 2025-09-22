import { Card } from "@repo/ui/card"
import { Star, TrendingUp, Users } from "lucide-react"

export function UseCasesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Perfect for{" "}
            <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-purple)] bg-clip-text text-transparent">
              everyone
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/30 transition-all duration-300">
            <Users className="w-12 h-12 text-[var(--neon-purple)] mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">Developers</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automate payouts, trigger notifications on smart contract events, and integrate Web2 services seamlessly.
            </p>
          </Card>

          <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/30 transition-all duration-300">
            <Star className="w-12 h-12 text-[var(--neon-blue)] mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">Creators</h3>
            <p className="text-muted-foreground leading-relaxed">
              Schedule social posts, send alerts on NFT sales, and automate fan engagement across platforms.
            </p>
          </Card>

          <Card className="glass-card border-glass-border p-8 text-center hover:border-primary/30 transition-all duration-300">
            <TrendingUp className="w-12 h-12 text-[var(--neon-green)] mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">Businesses</h3>
            <p className="text-muted-foreground leading-relaxed">
              Process payments, manage customer data, and connect your existing tools with blockchain workflows.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}


