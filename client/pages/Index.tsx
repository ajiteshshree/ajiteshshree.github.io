import { Download } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Index() {
  console.log('Index component is rendering...');
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Profile Picture */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="w-64 h-64 rounded-full bg-muted border-2 border-border overflow-hidden">
                <img
                  src="/profile-photo.jpg"
                  alt="Ajitesh Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Hero Text */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Hi, I'm <span className="text-foreground">Ajitesh</span>
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                A passionate developer who loves using AI tools to make stuff.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/resume.pdf"
                  download="Ajitesh_Resume.pdf"
                  className="inline-flex items-center px-6 py-3 border border-border hover:bg-accent text-foreground rounded-lg font-medium transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
              About Me
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Hi! I'm a full-stack developer who loves building digital stuff that actually works (most of the time 😄). I enjoy exploring new tools — especially AI — and finding ways to blend technology with real human experiences. Whether I'm coding up a new feature or tinkering with an idea, I like keeping things creative and curious. Physics, mathematics, and rockets are my side quests, and I often disappear down science rabbit holes just for fun.
            </p>
            <p>
              Outside of code, I'm probably testing the latest AI toy, collecting books I swear I'll read someday, or thinking about how to launch something (figuratively or literally 🚀). This blog is my little corner of the internet where I share what I learn — from web development lessons to tech experiments and occasional ramblings. If you're into code, curiosity, and the occasional rocket daydream, you'll feel right at home!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Ajitesh. Built with React, TypeScript, and lots of ☕
          </p>
        </div>
      </footer>
    </div>
  );
}
