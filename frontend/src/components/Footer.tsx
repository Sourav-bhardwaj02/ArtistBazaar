import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-foreground/90 text-white pt-10 pb-6 mt-8 border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h5 className="text-xl font-semibold mb-4 text-orange-400">Contact Us</h5>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>📍 Artist Bazaar, India</li>
            <li>📧 info@artistbazaar.in</li>
            <li>📞 +91 97XXXXXX</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-xl font-semibold mb-4 text-orange-400">Quick Links</h5>
          <ul className="text-sm space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-orange-400 transition-colors">Products</Link></li>
            <li><Link to="/artisans" className="hover:text-orange-400 transition-colors">Artisans</Link></li>
            <li><Link to="/chat" className="hover:text-orange-400 transition-colors">Talk to AI Assistant</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h5 className="text-xl font-semibold mb-4 text-orange-400">About</h5>
          <p className="text-sm text-gray-300 leading-relaxed">
            Artist Bazaar is committed to empowering local artisans through our platform by listing their handmade products via our AI-powered assistant, connecting directly with craftspeople, exploring their stories, and supporting local talent.
          </p>
          <div className="mt-4">
            <p className="text-xs text-gray-400">
              Made with ❤️ by{" "}
              <a
                href="https://github.com/Rogshivam/ArtistBazaar.git"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:text-orange-300 hover:underline font-semibold transition-colors"
              >
                ORA-SHI
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Artist Bazaar. All Rights Reserved.
      </div>
    </footer>
  );
}