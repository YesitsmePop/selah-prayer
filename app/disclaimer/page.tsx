import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="text-center py-12 px-4 border-b border-gray-200">
        <Link href="/" className="text-4xl font-serif text-foreground hover:text-primary transition-colors">
          Selah
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="sketch-border bg-card rounded-lg p-8 space-y-6">
          <h1 className="text-3xl font-serif text-foreground mb-6">How Selah Works</h1>

          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              <strong>Selah</strong> is a digital prayer space designed to provide comfort and a sense of connection
              through the act of prayer, without storing or transmitting your personal thoughts.
            </p>

            <h2 className="text-xl font-serif text-foreground mt-8 mb-4">What Happens When You Type</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Your keystrokes create a visual "vapor" effect that fades away</li>
              <li>No text is saved, stored, or transmitted to any server</li>
              <li>Your prayers remain completely private and between you and God</li>
              <li>The typing area is cleared after each submission</li>
            </ul>

            <h2 className="text-xl font-serif text-foreground mt-8 mb-4">The Purpose</h2>
            <p className="text-muted-foreground">
              This site serves as a psychological and spiritual tool. The act of typing out your prayers can help you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>Focus your thoughts and intentions</li>
              <li>Confirm on your side of heaven that God has heard you</li>
              <li>Experience the meditative act of prayer</li>
              <li>Find comfort in the practice of "sending" your prayers</li>
            </ul>

            <h2 className="text-xl font-serif text-foreground mt-8 mb-4">Privacy & Security</h2>
            <p className="text-muted-foreground">Your privacy is sacred. This website:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>Does not collect, store, or analyze your typed content</li>
              <li>Does not require registration or personal information</li>
              <li>Does not use cookies to track your prayers</li>
              <li>Operates entirely in the browser</li>
            </ul>

            <div className="bg-muted/50 p-4 rounded-lg mt-8">
              <p className="text-sm text-muted-foreground italic">
                "Selah" is a Hebrew word found throughout the Psalms, often interpreted as a pause for reflection. This
                space is designed to provide that same moment of pause, reflection, and connection with the divine.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/">
              <Button className="sketch-border bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-serif">
                Return to Prayer
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
