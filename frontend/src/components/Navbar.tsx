import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X, ShoppingCart, LogOut, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// import Avatar from 'boring-avatars';
import logo from '../assets/logo-temp.png';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/context/CartContext/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAlert } from '@/context/alert/AlertContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Types
interface User {
  name?: string;
  role?: string;
}
interface NavLink {
  name: string;
  path: string;
  isHash?: boolean;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { showSuccess } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const currentHash = location.hash || '#home';

  // Check auth
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({ name: parsedUser.name || 'User', role: parsedUser.role || 'Customer' });
        } catch {
          setUser(null);
        }
      } else setUser(null);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsMenuOpen(false);
    showSuccess('Logged out successfully');
    navigate('/');
  };

  const navLinks: NavLink[] = [
    { name: 'Home', path: '/', isHash: true },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about', isHash: true },
    ...(user ? [{ name: 'Chat', path: '/chat' }] : []),
  ];

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) =>
      link.isHash ? (
        <HashLink
          key={link.path}
          to={link.path}
          smooth
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={`block text-sm font-medium transition-colors ${currentHash === link.path ? 'text-muted-green' : 'text-beige hover:text-muddy-brown'
            }`}
        >
          {link.name}
        </HashLink>
      ) : (
        <Link
          key={link.path}
          to={link.path}
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={`block text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-muted-green' : 'text-beige hover:text-muddy-brown'
            }`}
        >
          {link.name}
        </Link>
      )
    );

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md shadow-lg bg-foreground/70">
      <nav className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center text-beige font-bold text-lg">
          <img src={logo} alt="Artist Bazaar Logo" className="h-10 w-10 mr-2" />
          <span>Artist Bazaar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {renderNavLinks()}
          {!user ? (
            <>
              {/* Uncomment if you want to keep these links */}
              {/* <Link to="/login" className="text-sm font-medium text-beige hover:text-muddy-brown">
                Login
              </Link>
              <Link to="/signup" className="text-sm font-medium text-beige hover:text-muddy-brown">
                Sign Up
              </Link> */}
            </>
          ) : null}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {user && (
            <>
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-beige hover:text-muddy-brown"
                onClick={() => navigate('/products')}
              >
                <Heart className="h-5 w-5" />
                {getWishlistCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                    {getWishlistCount()}
                  </Badge>
                )}
              </Button>
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-beige hover:text-muddy-brown"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
              {/* Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : "JD"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-card/90 backdrop-blur-md text-foreground" align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button onClick={handleLogout} className="flex items-center w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!user && (
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
          {/* Mobile Toggle */}
          <button className="md:hidden text-beige hover:text-muddy-brown" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-mud/90 px-4 pb-4 pt-2 space-y-2">
          {renderNavLinks(true)}
          {!user ? (
            <>
              {/* Uncomment if you want to keep these links */}
              {/* <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1 font-medium text-beige hover:text-muddy-brown">
                Login
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1 font-medium text-beige hover:text-muddy-brown">
                Sign Up
              </Link> */}
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-sm py-1 font-medium text-beige hover:text-muddy-brown"
            >
              <LogOut className="w-4 h-4 inline mr-1" />
              Logout
            </button>
          )}
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Navbar;