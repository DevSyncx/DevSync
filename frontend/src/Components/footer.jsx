import { Github, Mail,Facebook ,Linkedin,Twitter} from "lucide-react";
import { Link } from "react-router-dom"; // or use `next/link` if using Next.js

const Footer = () => {
  return (
  <footer className="rounded-lg mt-32 pt-24 pb-10 px-6 md:px-12" style={{ background: "var(--card)", color: "var(--card-foreground)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--primary)" }}>DevSync</h3>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Stay ahead. Stay synced. Stay Dev.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--primary)" }}>Navigate</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <li><a href="#home" style={{ color: "var(--card-foreground)" }}>Home</a></li>
            <li><a href="#features" style={{ color: "var(--card-foreground)" }}>Features</a></li>
            <li><a href="#about" style={{ color: "var(--card-foreground)" }}>About</a></li>
            <li><a href="#contact" style={{ color: "var(--card-foreground)" }}>Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--primary)" }}>Resources</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <li><a href="#" style={{ color: "var(--card-foreground)" }}>Documentation</a></li>
            <li><a href="#" style={{ color: "var(--card-foreground)" }}>API Reference</a></li>
            <li><a href="#" style={{ color: "var(--card-foreground)" }}>Community</a></li>
            <li><a href="#" style={{ color: "var(--card-foreground)" }}>Support</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--primary)" }}>Connect</h4>
          <div className="flex items-center gap-4 mt-2" style={{ color: "var(--primary)" }}>
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
      <div className="mt-12 pt-6 text-center text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
        © {new Date().getFullYear()} DevSync. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
