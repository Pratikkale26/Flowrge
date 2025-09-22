import { Zap } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Flowrge</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 Flowrge. Built for the Solana ecosystem.</p>
        </div>
      </div>
    </footer>
  )
}


