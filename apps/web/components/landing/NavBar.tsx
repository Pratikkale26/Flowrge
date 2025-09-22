import { Button } from "@repo/ui/button"
import { Zap } from "lucide-react"

export function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-balance">Flowrge</span>
          </div>
          <Button
            variant="outline"
            className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 bg-transparent"
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    </nav>
  )
}


