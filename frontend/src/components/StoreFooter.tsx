import { Link } from 'react-router-dom';


export default function StoreFooter() {
  return (
    <footer className="bg-brand-cream border-t border-gray-200 py-12 px-4 md:px-12 mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="font-heading italic text-2xl text-brand-blue tracking-wide hover:opacity-80 transition-opacity">
            Nun Kun
          </Link>
          <p className="font-body text-sm text-gray-500 mt-1">Made with love & butter.</p>
        </div>

        {/* Center: Links */}
        <div className="flex gap-6 font-body text-sm text-gray-600">
          <Link to="/menu" className="hover:text-brand-terracotta transition-colors">Menu</Link>
          <Link to="/track-order" className="hover:text-brand-terracotta transition-colors">Track Order</Link>
          <Link to="/account" className="hover:text-brand-terracotta transition-colors">Account</Link>
        </div>

        {/* Right: Copyright & Socials */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
          <p className="font-body text-xs text-gray-400">© 2026 Nun Kun Bakery. Delhi, IN.</p>
        </div>
        
      </div>
    </footer>
  );
}
