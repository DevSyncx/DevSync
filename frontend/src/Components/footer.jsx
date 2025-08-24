import { Github, Mail,Facebook ,Linkedin,Twitter} from "lucide-react";
import { Link } from "react-router-dom"; // or use `next/link` if using Next.js

const Footer = () => {
  return (
    <footer className="bg-slate-900 rounded-lg text-white mt-32 pt-24 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-bold mb-2 tracking-tight">DevSync</h3>
          <p className="text-sm text-slate-300">
            Stay ahead. Stay synced. Stay Dev.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Navigate</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><a href="#" className="hover:text-white">Documentation</a></li>
            <li><a href="#" className="hover:text-white">API Reference</a></li>
            <li><a href="#" className="hover:text-white">Community</a></li>
            <li><a href="#" className="hover:text-white">Support</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Connect</h4>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://github.com/devsync-org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@devsync.com"
              className="hover:text-blue-400"
            >
              <Mail className="w-5 h-5" />
            </a>
            
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} DevSync. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
