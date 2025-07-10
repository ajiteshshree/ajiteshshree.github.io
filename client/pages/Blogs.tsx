import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Plus, Calendar, Clock, X, Image, Trash2, ArrowLeft, Edit } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content?: string;
  image?: string;
}

const mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Welcome to My Blog!",
    excerpt: "A quick introduction to what you can expect from this space - thoughts on tech, AI, and the occasional rocket daydream.",
    date: "2025-01-10",
    readTime: "3 min read",
    content: `Welcome to my little corner of the internet! 🚀

I'm excited to share my thoughts, experiments, and discoveries with you here. You'll find posts about:

• Web development tips and tricks
• AI tools and experiments I'm working with
• Physics and mathematics rabbit holes I fall into
• Book recommendations (from my ever-growing collection)
• Random thoughts on technology and life

This blog is built with React, TypeScript, and a lot of curiosity. Feel free to explore, and don't hesitate to reach out if something resonates with you!

Thanks for stopping by, and I hope you enjoy the journey ahead.`,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Building This Blog: A React & TypeScript Journey", 
    excerpt: "How I built this personal blog website using React, TypeScript, and modern web technologies - plus some lessons learned along the way.",
    date: "2025-01-08",
    readTime: "7 min read",
    content: `Creating this blog has been an interesting journey of combining modern web technologies with good old-fashioned storytelling.

## The Tech Stack

I chose React and TypeScript for the frontend because they provide excellent developer experience and type safety. The styling is handled by Tailwind CSS with a custom design system that supports both light and dark modes.

## Key Features

• **Responsive Design**: Works beautifully on all devices
• **Dark/Light Mode**: Automatic theme switching
• **Admin Controls**: Full CRUD operations for blog posts
• **Image Support**: Easy image integration for posts
• **Local Storage**: Persistent data across sessions

## Lessons Learned

Building this reminded me why I love web development - the perfect blend of creativity and logic. Every component tells a story, and every interaction feels intentional.

The deployment to GitHub Pages was particularly satisfying. There's something magical about pushing code and seeing it live on the internet within minutes.

## What's Next?

I'm planning to add features like:
- Search functionality
- Tag-based filtering
- Comment system
- RSS feed

The journey continues! 🎯`,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "AI Tools That Actually Make a Difference",
    excerpt: "My honest take on AI tools that have genuinely improved my workflow, and some that are just hype.",
    date: "2025-01-05", 
    readTime: "5 min read",
    content: `After trying dozens of AI tools, here are the ones that actually stuck in my daily workflow.

## The Game Changers

**GitHub Copilot**: Still the best coding assistant. It's like having a pair programmer who never gets tired and knows every language.

**ChatGPT/Claude**: For brainstorming, explaining complex concepts, and rubber duck debugging. The quality of conversation is remarkable.

**Midjourney**: When I need visuals for projects, it's incredibly fast and creative.

## The Overhyped

Some tools promise the world but deliver confusion. The key is finding AI that enhances your existing workflow rather than forcing you to completely change how you work.

## My Philosophy

AI should amplify human creativity, not replace it. The best AI tools make me more productive at things I already want to do, rather than convincing me to do entirely new things.

What AI tools have actually improved your workflow? I'm always curious to hear what's working for others.`,
    image: "/placeholder.svg"
  }
];

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    readTime: "",
    image: "",
  });

  // Load blogs from localStorage on component mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) {
      try {
        const parsedBlogs = JSON.parse(savedBlogs);
        // If there are saved blogs, use them; otherwise fall back to mock blogs
        if (parsedBlogs && parsedBlogs.length > 0) {
          setBlogs(parsedBlogs);
        } else {
          setBlogs(mockBlogs);
        }
      } catch (error) {
        console.error('Error loading blogs from localStorage:', error);
        // If there's an error, fall back to mock blogs
        setBlogs(mockBlogs);
      }
    } else {
      // If no saved blogs, use mock blogs as initial data
      setBlogs(mockBlogs);
      // Also save the mock blogs to localStorage for future visits
      localStorage.setItem('blogs', JSON.stringify(mockBlogs));
    }
  }, []);

  // Save blogs to localStorage whenever blogs state changes
  useEffect(() => {
    if (blogs.length >= 0) { // Save even if empty array
      localStorage.setItem('blogs', JSON.stringify(blogs));
      console.log('Blogs saved to localStorage:', blogs.length, 'blogs');
    }
  }, [blogs]);

  // Simple admin check - in a real app, this would be handled by authentication
  const isAdmin = true; // For demo purposes, always show admin features

  const handleAddBlog = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      readTime: "",
      image: "",
    });
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || "",
      readTime: blog.readTime,
      image: blog.image || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.readTime) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingBlog) {
      // Update existing blog
      const updatedBlog: BlogPost = {
        ...editingBlog,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        readTime: formData.readTime,
        image: formData.image || undefined,
      };

      setBlogs(blogs.map(blog => 
        blog.id === editingBlog.id ? updatedBlog : blog
      ));
      
      // Update selectedBlog if we're currently viewing the edited blog
      if (selectedBlog && selectedBlog.id === editingBlog.id) {
        setSelectedBlog(updatedBlog);
      }
    } else {
      // Add new blog
      const newBlog: BlogPost = {
        id: Date.now(), // Simple ID generation
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        date: new Date().toISOString().split("T")[0],
        readTime: formData.readTime,
        image: formData.image || undefined,
      };

      setBlogs([newBlog, ...blogs]);
    }

    handleCloseModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteBlog = (blogId: number) => {
    const blogToDelete = blogs.find(blog => blog.id === blogId);
    if (blogToDelete && window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`)) {
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      // If we're viewing the deleted blog, go back to list
      if (selectedBlog && selectedBlog.id === blogId) {
        setSelectedBlog(null);
      }
    }
  };

  const handleReadMore = (blog: BlogPost) => {
    setSelectedBlog(blog);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Individual Blog Post View */}
      {selectedBlog ? (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBackToList}
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog List
            </button>

            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                {selectedBlog.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(selectedBlog.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedBlog.readTime}
                </div>
              </div>

              {/* Admin Controls for Individual Blog */}
              {isAdmin && (
                <div className="flex justify-end mb-6 space-x-2">
                  <button
                    onClick={() => handleEditBlog(selectedBlog)}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950"
                    title="Edit blog post"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(selectedBlog.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                    title="Delete blog post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Blog Image */}
            {selectedBlog.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {selectedBlog.excerpt}
              </p>
              
              {selectedBlog.content ? (
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No additional content available for this blog post.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Blog List View
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
                Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Thoughts, tutorials, and insights about web development,
                technology, and life.
              </p>
            </div>

            {/* Admin Add Blog Button */}
            {isAdmin && (
              <div className="mb-8 flex justify-end">
                <button
                  onClick={handleAddBlog}
                  className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-lg font-medium transition-colors hover:bg-foreground/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Blog
                </button>
              </div>
            )}

            {/* Blog Posts */}
            <div className="space-y-8">
              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No blog posts yet. Check back soon!
                  </p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className="flex justify-end mb-4 space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBlog(blog);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950"
                          title="Edit blog post"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlog(blog.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                          title="Delete blog post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Blog Image */}
                    {blog.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="cursor-pointer">
                      <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-muted-foreground transition-colors">
                        {blog.title}
                      </h2>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(blog.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.readTime}
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {blog.excerpt}
                      </p>

                      <button 
                        onClick={() => handleReadMore(blog)}
                        className="text-foreground font-medium hover:text-muted-foreground transition-colors"
                      >
                        Read more →
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Brief description of your blog post"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Write your blog content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Image className="inline h-4 w-4 mr-1" />
                    Blog Image
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Enter image URL or path (e.g., /blog-image.jpg)"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an image URL or upload your image to the public folder and reference it (e.g., /my-blog-image.jpg)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Read Time *
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="e.g., 5 min read"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    {editingBlog ? "Update Blog Post" : "Add Blog Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
