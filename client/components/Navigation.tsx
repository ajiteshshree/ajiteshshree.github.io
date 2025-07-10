import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Coffee, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out error:', error);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="font-display font-bold text-xl text-foreground flex items-center gap-2"
            >
              <Coffee className="h-5 w-5 text-orange-600" />
              Ajitesh
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    location.pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Button */}
              <button
                onClick={handleAuthAction}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {user ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    {isAdmin ? "Admin" : "Sign Out"}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-lg",
                      location.pathname === item.href
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Button */}
                <button
                  onClick={() => {
                    handleAuthAction();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                >
                  {user ? (
                    <>
                      <LogOut className="h-5 w-5 mr-3" />
                      {isAdmin ? "Admin Logout" : "Sign Out"}
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-3" />
                      Admin Login
                    </>
                  )}
                </button>

                {/* Mobile Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-5 w-5 mr-3" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5 mr-3" />
                      Light Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
