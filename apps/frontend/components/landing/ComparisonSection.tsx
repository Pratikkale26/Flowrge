import { Card } from "@repo/ui/card"
import { CheckCircle, TrendingUp } from "lucide-react"

export function ComparisonSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Why choose{" "}
            <span className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              Flowrge?
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Traditional Tools vs Flowrge</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                <span>Native Solana blockchain triggers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                <span>Built-in crypto actions (send SOL, tokens)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                <span>Lower fees than traditional platforms</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                <span>Web3-native user experience</span>
              </div>
            </div>
          </div>

          <Card className="glass-card border-glass-border p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Built for Web3</h4>
              <p className="text-muted-foreground leading-relaxed">
                The first automation platform designed specifically for the Solana ecosystem and Web3 workflows.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}


