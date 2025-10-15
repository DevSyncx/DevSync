import { Github, Mail,Facebook ,Linkedin,Twitter} from "lucide-react";
import { Link } from "react-router-dom"; // or use `next/link` if using Next.js

const Footer = () => {
  return (
  <footer className="rounded-lg mt-32 pt-24 pb-10 px-6 md:px-12" style={{ background: "var(--card)", color: "var(--card-foreground)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-bold mb-2 tracking-tight cursor-pointer transition-all duration-300 hover:scale-105 hover:text-blue-400" style={{ color: "var(--primary)" }}>DevSync</h3>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Stay ahead. Stay synced. Stay Dev.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--primary)" }}>Navigate</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <li><a href="#home" className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" style={{ color: "var(--card-foreground)" }}>Home</a></li>
            <li><a href="#features" className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" style={{ color: "var(--card-foreground)" }}>Features</a></li>
            <li><a href="#about" className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" style={{ color: "var(--card-foreground)" }}>About</a></li>
            <li><a href="#contact" className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" style={{ color: "var(--card-foreground)" }}>Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--primary)" }}>Resources</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <li>
              <a
                href="https://github.com/DevSyncx/DevSync/tree/main/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block transition-colors duration-200 hover:text-neutral-400 
                          after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 
                          after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all 
                          after:duration-300 hover:after:w-full"
                style={{ color: "var(--card-foreground)" }}
              >
                Documentation
              </a>
            </li>

            <li><a href="#" className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" style={{ color: "var(--card-foreground)" }}>API Reference</a></li>
            <li>
              <Link 
                to="/feedback" 
                className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" 
                style={{ color: "var(--card-foreground)" }}
              >
                Community Feedback
              </Link>
            </li>
            <li><a href="#" className="relative inline-block transition-colors duration-200 hover:text-neutral-400 after:content-[''] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full" style={{ color: "var(--card-foreground)" }}>Support</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: "var(--primary)" }}>Connect</h4>
          <div className="flex items-center gap-4 mt-2" style={{ color: "var(--primary)" }}>
            <a
              href="https://github.com/DevSyncx/DevSync"
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
              href="https://www.linkedin.com/in/annanyatiwary4"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* ✅ Twitter (X) logo */}
            <a
              href="https://x.com/Annan_ya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 1200"
                className="w-5 h-5 fill-current"
              >
                <path d="M714.163 519.284 1160.89 0H1057.07L669.11 450.887 356.926 0H0l468.661 684.215L0 1226.31h103.816l410.367-475.25 332.407 475.25H1200L714.137 519.284h.026Zm-145.103 168.49-47.568-67.864L144.592 79.597h162.02l305.022 435.792 47.568 67.863 404.7 577.902H901.882l-332.822-472.38Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
          className="mt-12 pt-6 text-center text-sm space-y-1"
          style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}
        >
          <p>© {new Date().getFullYear()} DevSync. All rights reserved.</p>
          <p>
            Made with ☕ by <span className="font-semibold text-[var(--primary)]">Annanya</span>
          </p>
        </div>
    </footer>
  );
};

export default Footer;
