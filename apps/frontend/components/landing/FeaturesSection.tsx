import { Card, CardContent } from "@repo/ui/card"
import { Globe, Shield, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Build powerful{" "}
            <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              automations
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect Web3 and Web2 services with simple drag-and-drop flows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card border-glass-border hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Webhook Triggers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start automations with HTTP webhooks. Solana on-chain triggers coming soon for real-time blockchain
                events.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-green)] to-[var(--neon-purple)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Cross-Platform Actions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Send SOL, post on social media, write to Google Sheets, send emails, and more - all from one platform.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-green)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Simple Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create complex "flows" in seconds with our intuitive visual builder. No coding required.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}


