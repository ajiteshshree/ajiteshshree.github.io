import Navigation from "@/components/Navigation";
import { Github, Linkedin, Mail } from "lucide-react";

// Import X (Twitter) icon as a custom SVG since it's not in Lucide
const XIcon = () => (
  <svg
    className="w-8 h-8"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  {
    name: "X",
    icon: XIcon,
    href: "https://x.com/shreelocked",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/ajiteshshree",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:ajitesh2021@gmail.com",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ajitesh-shree-030864245/",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Social Media Icons - Centered */}
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex gap-12">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110 transform"
                  >
                    <IconComponent size={32} className="w-8 h-8" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
