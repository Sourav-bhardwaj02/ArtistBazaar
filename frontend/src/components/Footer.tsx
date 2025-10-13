export default function Footer() {
  return (
    <footer className="bg-foreground/70 text-white pt-10 pb-6 mt-4">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h5 className="text-xl font-semibold mb-4">Contact Us</h5>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>
              📍 Artist Bazaar, India
            </li>
            <li>
              📧 info@artistbazaar.in
            </li>
            <li>
              📞 +91 97XXXXXX   
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
          <ul className="text-sm space-y-2 text-gray-300">
            <li><a href="#home" className="hover:text-primary">Home</a></li>
            <li><a href="#chat" className="hover:text-primary">Chat</a></li>
            <li><a href="#products" className="hover:text-primary">Products</a></li>
            <li><a href="#about" className="hover:text-primary">About</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h5 className="text-xl font-semibold mb-4">About</h5>
          <p className="text-sm text-gray-300">
            Artist Bazaar is committed to empowering local Artisan through our platform by listing there handmade products through our AI-powered assistant which connect directly with craftspeople, explore their stories, and support local talent.
          </p>
          <div>
            <p>
              made with ❤️ by <a href="https://github.com/Rogshivam/ArtistBazaar.git" className=" text-blue-400 hover:underline space-y-2">ORA-SHI</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-900 mt-8 pt-4 text-center text-white text-sm">
        &copy; 2025 Artist Bazaar. All Rights Reserved.
      </div>
    </footer>
  );
}