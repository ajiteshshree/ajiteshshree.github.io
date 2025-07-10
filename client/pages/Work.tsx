import Navigation from "@/components/Navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce platform built with React and Node.js",
    image: "/placeholder.svg",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    status: "Coming Soon",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates",
    image: "/placeholder.svg",
    tags: ["TypeScript", "Socket.io", "MongoDB", "React"],
    status: "Coming Soon",
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard for business intelligence",
    image: "/placeholder.svg",
    tags: ["React", "D3.js", "Python", "AWS"],
    status: "Coming Soon",
  },
];

export default function Work() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              My Work
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              A collection of projects I've worked on, from web applications to
              mobile apps and everything in between.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-brand-600 text-white text-xs font-medium rounded">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Project
                    </button>
                    <button className="px-4 py-2 border border-border hover:bg-accent text-foreground text-sm font-medium rounded-lg transition-colors">
                      <Github className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-muted/50 rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Interested in Working Together?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                I'm always excited to take on new challenges and collaborate on
                interesting projects. Let's discuss your ideas!
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
