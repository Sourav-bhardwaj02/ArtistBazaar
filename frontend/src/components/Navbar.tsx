import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import logo from '../assets/logo-temp.png';

import { useCart } from '@/context/CartContext/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAlert } from '@/context/alert/AlertContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDrawer } from '@/context/DrawerContext/DrawerContext'; 

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

interface NavbarProps {
  onCartOpen?: () => void;
  onWishlistOpen?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartOpen, onWishlistOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ Use global drawer context
  const { openCart, openWishlist } = useDrawer();

  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { showSuccess } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentHash = location.hash || '#home';
  const sellerId = localStorage.getItem("sellerId");

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
    { name: 'Artisans', path: '/artisans' },
    { name: 'About', path: '/about', isHash: true },
    ...(user ? [{ name: 'Chat', path: '/chat' }] : []),
  ];

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => {
      const isActive = link.isHash
        ? currentHash === link.path || (link.path === '/' && currentHash === '#home')
        : location.pathname === link.path;

      const activeClass = "bg-orange-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-md shadow-orange-500/25 border border-orange-400 transition-all text-sm";
      const inactiveClass = "text-gray-200 hover:text-orange-400 hover:bg-orange-500/15 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all border border-transparent hover:border-orange-500/30";

      return link.isHash ? (
        <HashLink
          key={link.path}
          to={link.path}
          smooth
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={isActive ? activeClass : inactiveClass}
        >
          {link.name}
        </HashLink>
      ) : (
        <Link
          key={link.path}
          to={link.path}
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={isActive ? activeClass : inactiveClass}
        >
          {link.name}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-orange-500/20 shadow-xl overflow-x-hidden text-white">
      <nav className="w-full max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center text-white hover:text-orange-400 transition-colors font-extrabold text-lg group">
          <img src={logo} alt="Artist Bazaar Logo" className="h-10 w-10 mr-2 group-hover:scale-105 transition-transform" />
          <span className="tracking-tight bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">Artist Bazaar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800">
          {renderNavLinks()}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {user && (
            <>
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-200 hover:text-orange-400 hover:bg-orange-500/15 border border-zinc-800 hover:border-orange-500/30 transition-all rounded-xl"
                onClick={onWishlistOpen || openWishlist}
                aria-label="Open wishlist"
              >
                <Heart className="h-5 w-5" />
                {getWishlistCount() > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white font-bold border-2 border-zinc-950">
                    {getWishlistCount()}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-200 hover:text-orange-400 hover:bg-orange-500/15 border border-zinc-800 hover:border-orange-500/30 transition-all rounded-xl"
                onClick={onCartOpen || openCart}
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500 text-white font-bold border-2 border-zinc-950">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>

              {/* Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-orange-500 transition-all" aria-label="User menu">
                    <Avatar className="h-10 w-10 border border-orange-500/40">
                      <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-sm">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : "AB"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white shadow-2xl" align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center w-full hover:text-orange-400 hover:bg-orange-500/15 transition-colors cursor-pointer py-2">
                      <User className="w-4 h-4 mr-2 text-orange-500" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/seller/${sellerId}`}
                      className="flex items-center w-full hover:text-orange-400 hover:bg-orange-500/15 transition-colors cursor-pointer py-2"
                    >
                      <User className="w-4 h-4 mr-2 text-orange-500" />
                      {sellerId ? "Profile" : "Login"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem asChild>
                    <button onClick={handleLogout} className="flex items-center w-full text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-colors cursor-pointer py-2">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!user && (
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25 transition-all rounded-xl px-5" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
          {/* Mobile Toggle */}
          <button className="md:hidden text-gray-200 hover:text-orange-400 p-1.5 rounded-lg border border-zinc-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pb-4 pt-3 space-y-2 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {renderNavLinks(true)}
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center text-sm py-2 font-semibold text-red-400 hover:text-red-300 transition-colors w-full border-t border-zinc-800 pt-3 mt-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout ({user.name})
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
