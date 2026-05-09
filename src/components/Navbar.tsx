import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/lead-learnhub-logo.png";

const links = [
  ["Home", "#home"],
  ["Courses", "#courses"],
  ["Tutors", "#tutors"],
  ["Marketplace", "#marketplace"],
  ["Live Classes", "#live"],
  ["Pricing", "#pricing"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className="container-x flex items-center justify-between rounded-full px-4 md:px-6 py-2.5 bg-white border border-border shadow-[var(--shadow-soft)] transition-all"
      >
        <a href="#home" className="flex items-center gap-2.5 group">
          <img src={logo} alt="LEAD LearnHub" className="h-10 md:h-12 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-foreground/80 hover:text-foreground">
            Log in
          </Link>
          <Link to="/register" className="btn-primary !py-2.5 !px-5">Get Started</Link>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden grid place-items-center h-10 w-10 rounded-full bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden container-x mt-2">
          <div className="glass-light rounded-3xl p-6 shadow-[var(--shadow-soft)]">
            <nav className="flex flex-col gap-3">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium py-2 border-b border-border/60"
                >
                  {label}
                </a>
              ))}
              <div className="flex gap-3 pt-3">
                <a href="#" className="btn-outline flex-1">Log in</a>
                <a href="#" className="btn-primary flex-1">Get Started</a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
