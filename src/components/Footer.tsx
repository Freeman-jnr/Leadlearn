import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";

const cols = [
  { title: "Learn", links: ["Courses", "Live Classes", "Tutors", "Certifications"] },
  { title: "Marketplace", links: ["Textbooks", "VR Books", "Assessments", "Digital Resources"] },
  { title: "Company", links: ["About LEAD", "SDG Mission", "Careers", "Press"] },
  { title: "Support", links: ["Help Center", "Community", "Privacy", "Terms"] },
];

export function Footer() {
  return (
    <footer
      className="relative pt-24 pb-10 px-6 md:px-10 text-white"
      style={{ background: "var(--ink)" }}
    >
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-3 inline-block">
            <img src={logo} alt="LEAD LearnHub" className="h-14 w-auto" />
          </div>
          <p className="text-sm text-white/65 max-w-sm">
            Leveraging on Education and Advocacy for Sustainable Development Goals.
            Empowering learners worldwide through accessible, premium digital education.
          </p>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Newsletter</p>
            <form className="flex glass rounded-full p-1.5 max-w-sm">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent outline-none px-4 text-sm placeholder:text-white/40"
              />
              <button className="btn-primary !py-2 !px-5 text-xs">Subscribe</button>
            </form>
          </div>

          <div className="flex gap-3 pt-2">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/15 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/60 hover:text-emerald transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="text-xs text-white/50">
          © 2026 LEAD LearnHub. Built for the SDGs. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-2">
          {["SDG 4", "SDG 5", "SDG 10", "SDG 17"].map((s) => (
            <span
              key={s}
              className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-white/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
