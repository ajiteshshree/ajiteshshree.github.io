import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Plus, Calendar, Clock, X, Image, Trash2, ArrowLeft, Edit, Loader2, Eye, Code } from "lucide-react";
import { 
  BlogPost, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  subscribeToBlogPosts 
} from "@/lib/blogService";
import { useAuth } from "@/contexts/AuthContext";
import DOMPurify from 'dompurify';
import '../blog-content.css';

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: ""
  });

  // Get authentication state
  const { isAdmin } = useAuth();

  // Safely render HTML content
  const renderHTMLContent = (htmlContent: string) => {
    const sanitizedContent = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'img', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
      ALLOW_DATA_ATTR: false
    });
    return { __html: sanitizedContent };
  };

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    console.log('Setting up Firestore subscription...');
    const unsubscribe = subscribeToBlogPosts((posts) => {
      console.log('Received posts from Firestore:', posts.length);
      setBlogs(posts);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up Firestore subscription');
      unsubscribe();
    };
  }, []);

  // Format date helper
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleAddBlog = () => {
    if (!isAdmin) {
      alert('You must be logged in as an admin to create blog posts');
      return;
    }
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: ""
    });
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setIsPreviewMode(false);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: ""
    });
  };

  const handleEditBlog = (blog: BlogPost) => {
    if (!isAdmin) {
      alert('You must be logged in as an admin to edit blog posts');
      return;
    }
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image || ""
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('You must be logged in as an admin to save blog posts');
      return;
    }
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting blog post...', formData);
      if (editingBlog) {
        // Update existing blog
        await updateBlogPost(editingBlog.id, {
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image || undefined
        });
        console.log('Blog post updated successfully');
      } else {
        // Create new blog
        const newId = await addBlogPost({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image || undefined
        });
        console.log('Blog post created successfully with ID:', newId);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save blog post: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!isAdmin) {
      alert('You must be logged in as an admin to delete blog posts');
      return;
    }
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(blogId);
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(null);
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  const handleReadMore = (blog: BlogPost) => {
    setSelectedBlog(blog);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading blogs...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
                  Blog Posts
                </h1>
                <p className="text-xl text-muted-foreground">
                  Thoughts, insights, and stories from my journey
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={handleAddBlog}
                  className="bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <Plus className="h-4 w-4" />
                  New Post
                </button>
              )}
            </div>
          </div>

          {/* Blog Detail View */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to posts
                </button>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditBlog(selectedBlog)}
                      className="flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(selectedBlog.id)}
                      className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedBlog.image && (
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {selectedBlog.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedBlog.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {calculateReadTime(selectedBlog.content)}
                  </div>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div 
                    className="blog-content text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={renderHTMLContent(selectedBlog.content)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-6">
              <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No blog posts yet
              </h3>
              <p className="text-muted-foreground">
                {isAdmin ? "Start writing your first blog post to share your thoughts!" : "Check back later for new blog posts!"}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={handleAddBlog}
                className="bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(blog.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {calculateReadTime(blog.content)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleReadMore(blog)}
                      className="text-foreground hover:text-foreground/80 font-medium"
                    >
                      Read More →
                    </button>
                    
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Blog Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
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
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-foreground">
                        Content * (HTML supported)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isPreviewMode ? (
                          <>
                            <Code className="h-4 w-4" />
                            Edit
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Preview
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* HTML Quick Guide */}
                    {!isPreviewMode && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-md border text-sm">
                        <details>
                          <summary className="cursor-pointer font-medium text-foreground mb-2">Quick HTML Guide</summary>
                          <div className="text-muted-foreground space-y-1">
                            <div><code>&lt;p&gt;Paragraph&lt;/p&gt;</code></div>
                            <div><code>&lt;strong&gt;Bold&lt;/strong&gt;</code> or <code>&lt;b&gt;Bold&lt;/b&gt;</code></div>
                            <div><code>&lt;em&gt;Italic&lt;/em&gt;</code> or <code>&lt;i&gt;Italic&lt;/i&gt;</code></div>
                            <div><code>&lt;a href="https://example.com" target="_blank"&gt;Link&lt;/a&gt;</code></div>
                            <div><code>&lt;h2&gt;Heading&lt;/h2&gt;</code> (h1-h6 available)</div>
                            <div><code>&lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;</code></div>
                            <div><code>&lt;blockquote&gt;Quote&lt;/blockquote&gt;</code></div>
                            <div><code>&lt;code&gt;Code&lt;/code&gt;</code></div>
                          </div>
                        </details>
                      </div>
                    )}
                    
                    {isPreviewMode ? (
                      <div className="w-full min-h-[300px] px-3 py-2 border border-border rounded-md bg-accent/20">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                          <div 
                            className="blog-content"
                            dangerouslySetInnerHTML={renderHTMLContent(formData.content || '<p className="text-muted-foreground">Start typing to see preview...</p>')}
                          />
                        </div>
                      </div>
                    ) : (
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={12}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground font-mono text-sm"
                        placeholder="Write your blog content here. HTML is supported!

Examples:
<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<a href='https://example.com' target='_blank'>This is a link</a>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>

<h3>This is a heading</h3>
<blockquote>This is a quote</blockquote>"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Featured Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingBlog ? "Update Post" : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
