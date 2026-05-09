import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Play, ArrowRight, Star, Users, BookOpen, Calendar, ShoppingCart,
  Video, Bot, ClipboardCheck, GraduationCap, Building2, Store, Check,
  UserPlus, Compass, Rocket, Quote, Zap, Brain, Globe2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImg from "@/assets/hero-dashboard.jpg";
import liveImg from "@/assets/live-class.jpg";
import mobileImg from "@/assets/mobile-app.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEAD LearnHub — Transforming Education Through Technology" },
      {
        name: "description",
        content:
          "LEAD LearnHub is a premium e-learning marketplace offering live classes, expert tutors, courses, and digital learning resources for the SDGs.",
      },
      { property: "og:title", content: "LEAD LearnHub — Premium Digital Learning" },
      {
        property: "og:description",
        content:
          "Live classrooms, tutor booking, certified courses & a digital marketplace built for sustainable education.",
      },
    ],
  }),
  component: Index,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <FeaturedCourses />
      <LiveClassroom />
      <Tutors />
      <Marketplace />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <MobileApp />
      <CTABanner />
      <Footer />
    </div>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  return (
    <section
      id="home"
      className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 md:px-10 overflow-hidden text-white"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* glow blobs */}
      <div
        className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.17 161 / 0.6), transparent 60%)" }}
      />
      <div
        className="absolute top-40 right-0 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.2 268 / 0.7), transparent 60%)" }}
      />

      <div className="container-x relative grid gap-14 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-emerald" />
            Powered by LEAD · Education for the SDGs
          </span>

          <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
            Transforming Education Through{" "}
            <span className="text-gradient">Technology</span> &{" "}
            <span className="text-gradient-brand">Sustainable Learning</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed">
            Virtual classrooms, live sessions, expert tutor booking, and a digital
            marketplace — a complete learning universe built around the UN Sustainable
            Development Goals.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#courses" className="btn-primary">
              Start Learning <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#tutors" className="btn-ghost">
              <Play className="h-4 w-4" /> Become a Tutor
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["10K+", "Students"],
              ["500+", "Tutors"],
              ["1.2K+", "Courses"],
              ["50+", "Schools"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl px-4 py-4">
                <div className="text-2xl font-bold text-gradient-brand">{n}</div>
                <div className="text-xs text-white/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[var(--shadow-glow)]">
            <img
              src={heroImg}
              alt="LEAD LearnHub futuristic learning dashboard"
              className="w-full h-auto"
              width={1536}
              height={1280}
            />
          </div>

          {/* Floating cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-4 top-10 glass rounded-2xl p-4 w-56"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald/20">
                <Video className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <div className="text-xs text-white/60">Live now</div>
                <div className="text-sm font-semibold">Physics 101</div>
              </div>
              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-3 bottom-12 glass rounded-2xl p-4 w-60"
          >
            <div className="flex items-center gap-2 text-orange">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs text-white/70 ml-1">4.9</span>
            </div>
            <p className="mt-2 text-sm font-semibold">“Best EdTech I've used.”</p>
            <p className="text-xs text-white/60">— Amara, Grade 12</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- TRUSTED -------------------- */
function TrustedBy() {
  const partners = [
    "UNESCO Partners", "GreenSchools", "EduAfrica", "BrightFuture NGO",
    "Global Learn", "SDG Academy", "OpenMinds", "FutureKids",
  ];
  return (
    <section className="py-16 px-6 md:px-10 border-y border-border bg-muted/40">
      <div className="container-x">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Trusted by leading schools, NGOs & educational partners
        </p>
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-12 animate-[marquee_30s_linear_infinite]" style={{ width: "max-content" }}>
            {[...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="text-xl md:text-2xl font-display font-bold text-foreground/40 hover:text-foreground transition-colors whitespace-nowrap"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- FEATURED COURSES -------------------- */
function FeaturedCourses() {
  const courses = [
    { cat: "Science", title: "Quantum Physics Fundamentals", tutor: "Dr. Adaeze N.", price: 49, rating: 4.9, hue: 268 },
    { cat: "Math", title: "Mastering Calculus for SHS", tutor: "Mr. Kwame O.", price: 39, rating: 4.8, hue: 161 },
    { cat: "Tech", title: "AI & Machine Learning Basics", tutor: "Sara L.", price: 79, rating: 5.0, hue: 70 },
    { cat: "Languages", title: "Conversational French", tutor: "Marie D.", price: 29, rating: 4.7, hue: 320 },
    { cat: "SDGs", title: "Sustainability in Action", tutor: "Prof. Eze", price: 0, rating: 4.9, hue: 161 },
    { cat: "Business", title: "Youth Entrepreneurship 101", tutor: "Tunde A.", price: 59, rating: 4.8, hue: 30 },
  ];
  return (
    <section id="courses" className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="Featured Courses"
          title="Learn from world-class educators"
          desc="Curated, certified, and crafted to deliver real results."
        />

        <motion.div {...fadeUp} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <article
              key={i}
              className="group rounded-3xl bg-card border border-border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
            >
              <div
                className="aspect-[16/10] relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, oklch(0.55 0.18 ${c.hue}), oklch(0.4 0.1 ${c.hue + 30}))`,
                }}
              >
                <div className="absolute inset-0 grid place-items-center text-white/30">
                  <BookOpen className="h-20 w-20" />
                </div>
                <span className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-xs font-medium text-white">
                  {c.cat}
                </span>
                <span className="absolute top-3 right-3 rounded-full bg-white/95 text-foreground px-3 py-1 text-xs font-bold">
                  {c.price === 0 ? "Free" : `$${c.price}`}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{ background: `linear-gradient(135deg, oklch(0.6 0.18 ${c.hue}), oklch(0.4 0.12 ${c.hue + 60}))` }}
                    />
                    <span className="text-xs text-muted-foreground">{c.tutor}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                    <span className="font-semibold">{c.rating}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- LIVE CLASSROOM -------------------- */
function LiveClassroom() {
  return (
    <section id="live" className="section relative overflow-hidden text-white" style={{ background: "var(--ink)" }}>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(700px 400px at 80% 20%, oklch(0.72 0.17 161 / 0.25), transparent 60%), radial-gradient(700px 400px at 0% 80%, oklch(0.55 0.2 268 / 0.3), transparent 60%)",
        }}
      />
      <div className="container-x relative grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...fadeUp} className="relative">
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-[var(--shadow-emerald)]">
            <img src={liveImg} alt="Live classroom" className="w-full" loading="lazy" width={1280} height={896} />
          </div>
          <div className="absolute -top-4 left-6 glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            LIVE · 248 watching
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs">
            <Video className="h-3.5 w-3.5 text-emerald" /> Live Classrooms
          </span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-tight">
            Real classrooms.{" "}
            <span className="text-gradient-brand">Reimagined for the web.</span>
          </h2>
          <p className="mt-5 text-white/70 max-w-lg">
            HD video conferencing, an interactive whiteboard, instant chat, polls,
            breakout rooms, and recordings — everything teachers and students need
            to stay engaged.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Interactive whiteboard with real-time collaboration",
              "Built-in attendance, polls and quizzes",
              "Auto-recorded sessions saved to your library",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-white/80">
                <Check className="h-5 w-5 text-emerald flex-shrink-0" /> {t}
              </li>
            ))}
          </ul>
          <a href="#" className="btn-primary mt-9">
            Join a Live Class <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- TUTORS -------------------- */
function Tutors() {
  const tutors = [
    { name: "Dr. Adaeze Nwosu", subj: "Physics & Astronomy", rate: 4.9, hue: 268 },
    { name: "Mr. Kwame Owusu", subj: "Mathematics", rate: 4.8, hue: 161 },
    { name: "Sara Lawal", subj: "Computer Science", rate: 5.0, hue: 70 },
    { name: "Marie Dubois", subj: "French Language", rate: 4.9, hue: 320 },
  ];
  return (
    <section id="tutors" className="section bg-muted/30">
      <div className="container-x">
        <SectionHeader
          eyebrow="Personal Tutor Booking"
          title="Book sessions with verified experts"
          desc="One-on-one mentorship that fits your schedule."
        />
        <motion.div {...fadeUp} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((t) => (
            <article key={t.name} className="rounded-3xl bg-card border border-border p-6 hover:shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1">
              <div
                className="h-24 w-24 mx-auto rounded-full mb-5 ring-4 ring-background relative"
                style={{ background: `linear-gradient(135deg, oklch(0.6 0.18 ${t.hue}), oklch(0.4 0.1 ${t.hue + 40}))` }}
              >
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald ring-2 ring-card" />
              </div>
              <h3 className="text-center font-display text-lg font-semibold">{t.name}</h3>
              <p className="text-center text-sm text-muted-foreground mt-1">{t.subj}</p>
              <div className="mt-3 flex justify-center items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                <span className="font-semibold">{t.rate}</span>
                <span className="text-muted-foreground">· 120+ sessions</span>
              </div>
              <button className="mt-5 w-full btn-outline !py-2.5 text-xs">
                <Calendar className="h-4 w-4" /> Book Session
              </button>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- MARKETPLACE -------------------- */
function Marketplace() {
  const items = [
    { name: "SHS Physics Textbook", type: "Textbook", price: 24, hue: 268 },
    { name: "Math Assessment Pack", type: "Assessment", price: 15, hue: 30 },
    { name: "Biology VR Atlas", type: "VR Book", price: 49, hue: 161 },
    { name: "QR Interactive Reader", type: "QR Book", price: 19, hue: 320 },
  ];
  return (
    <section id="marketplace" className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="Educational Marketplace"
          title="Books, resources & immersive learning tools"
          desc="From traditional textbooks to VR-powered interactive content."
        />
        <motion.div {...fadeUp} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <article key={it.name} className="rounded-3xl border border-border overflow-hidden bg-card hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all group">
              <div
                className="aspect-[4/5] relative grid place-items-center"
                style={{
                  background: `linear-gradient(160deg, oklch(0.95 0.04 ${it.hue}), oklch(0.85 0.08 ${it.hue + 20}))`,
                }}
              >
                <BookOpen className="h-20 w-20 text-foreground/30 group-hover:scale-110 transition-transform" />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {it.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold leading-snug">{it.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-gradient-brand">${it.price}</span>
                  <button className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: "var(--gradient-brand)" }}>
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- HOW IT WORKS -------------------- */
function HowItWorks() {
  const steps = [
    { icon: UserPlus, title: "Create your account", desc: "Sign up in seconds — student, parent, or tutor." },
    { icon: Compass, title: "Choose your path", desc: "Pick courses, subscribe, or book live sessions." },
    { icon: Rocket, title: "Learn from anywhere", desc: "Web, mobile, offline — your classroom travels with you." },
  ];
  return (
    <section className="section bg-muted/30">
      <div className="container-x">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps to a smarter you"
          desc="Get started in minutes."
        />
        <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px" style={{ background: "linear-gradient(90deg, transparent, var(--color-emerald), var(--color-primary), transparent)" }} />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center"
            >
              <div className="mx-auto h-24 w-24 grid place-items-center rounded-3xl text-white relative" style={{ background: "var(--gradient-brand)" }}>
                <s.icon className="h-10 w-10" />
                <span className="absolute -top-2 -right-2 h-8 w-8 grid place-items-center rounded-full bg-orange text-white font-bold text-sm shadow-lg">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- FEATURES -------------------- */
function Features() {
  const features = [
    { icon: Video, title: "Live Classes", desc: "Interactive HD virtual classrooms." },
    { icon: Play, title: "Recorded Sessions", desc: "Catch up anytime, on any device." },
    { icon: Bot, title: "AI Learning Support", desc: "Personalized 24/7 study companion." },
    { icon: ClipboardCheck, title: "Online Assessments", desc: "Smart quizzes with instant feedback." },
    { icon: Calendar, title: "Tutor Booking", desc: "1-on-1 sessions with verified experts." },
    { icon: Zap, title: "Subscription Access", desc: "All-in-one premium learning pass." },
    { icon: Building2, title: "School Partnerships", desc: "Bring LearnHub into your institution." },
    { icon: Store, title: "Digital Marketplace", desc: "Books, VR, resources & more." },
  ];
  return (
    <section id="about" className="section relative overflow-hidden text-white" style={{ background: "var(--ink)" }}>
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(900px 500px at 50% 0%, oklch(0.72 0.17 161 / 0.18), transparent 60%)" }} />
      <div className="container-x relative">
        <SectionHeader
          eyebrow="Premium Features"
          title="Everything you need to thrive"
          desc="Designed for modern learners, teachers and institutions."
          dark
        />
        <motion.div {...fadeUp} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-3xl p-6 hover:bg-white/[0.12] transition-colors group">
              <div className="h-12 w-12 grid place-items-center rounded-2xl bg-emerald/15 text-emerald mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-white/65">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- TESTIMONIALS -------------------- */
function Testimonials() {
  const items = [
    { name: "Amara O.", role: "SHS Student, Lagos", quote: "LearnHub transformed how I study. The live tutors and recorded sessions saved my exams!", hue: 320 },
    { name: "Mr. Kwame O.", role: "Tutor", quote: "I've reached more students in 6 months than I did in 6 years. The platform is world-class.", hue: 161 },
    { name: "Sarah B.", role: "Parent", quote: "Finally, an EdTech platform that works on a slow connection and looks beautiful too.", hue: 268 },
  ];
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="Testimonials"
          title="Loved by students, parents & schools"
        />
        <motion.div {...fadeUp} className="mt-14 grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure key={t.name} className="rounded-3xl bg-card border border-border p-7 shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-transform">
              <Quote className="h-8 w-8 text-emerald" />
              <blockquote className="mt-4 text-foreground/85 leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-full"
                  style={{ background: `linear-gradient(135deg, oklch(0.6 0.18 ${t.hue}), oklch(0.4 0.12 ${t.hue + 40}))` }}
                />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- PRICING -------------------- */
function Pricing() {
  const plans = [
    { name: "Basic", price: 0, tagline: "Start exploring", features: ["10 free courses", "Community access", "Mobile app"], cta: "Get started" },
    { name: "Standard", price: 12, tagline: "For active learners", features: ["Unlimited courses", "Live classes", "Certificates", "Marketplace discounts"], cta: "Choose Standard", popular: true },
    { name: "Premium", price: 29, tagline: "All-access pass", features: ["Everything in Standard", "1-on-1 tutor credits", "AI study assistant", "Offline downloads", "Priority support"], cta: "Go Premium" },
  ];
  return (
    <section id="pricing" className="section bg-muted/30">
      <div className="container-x">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans for every learner"
          desc="Cancel anytime. No hidden fees."
        />
        <motion.div {...fadeUp} className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 border transition-all ${
                p.popular
                  ? "text-white border-transparent shadow-[var(--shadow-glow)] md:scale-105"
                  : "bg-card border-border"
              }`}
              style={p.popular ? { background: "var(--gradient-brand)" } : undefined}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange text-white text-[10px] font-bold tracking-wider px-3 py-1">
                  MOST POPULAR
                </span>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className={`text-sm mt-1 ${p.popular ? "text-white/80" : "text-muted-foreground"}`}>{p.tagline}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-bold">${p.price}</span>
                <span className={`text-sm pb-2 ${p.popular ? "text-white/70" : "text-muted-foreground"}`}>/mo</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-5 w-5 flex-shrink-0 ${p.popular ? "text-white" : "text-emerald"}`} /> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all ${
                  p.popular
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- MOBILE APP -------------------- */
function MobileApp() {
  return (
    <section className="section">
      <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-medium">
            <Globe2 className="h-3.5 w-3.5" /> iOS · Android · Web
          </span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold">
            Your classroom, <span className="text-gradient-brand">in your pocket</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg max-w-md">
            Stream live classes, browse the marketplace, and continue learning offline
            — wherever you are.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="btn-primary">Download for iOS</a>
            <a href="#" className="btn-outline">Download for Android</a>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold">4.9★</div>
              <div className="text-xs text-muted-foreground">App Store</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100K+</div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
          <img src={mobileImg} alt="LEAD LearnHub mobile app" className="w-full" loading="lazy" width={1536} height={1024} />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- CTA BANNER -------------------- */
function CTABanner() {
  return (
    <section id="contact" className="px-6 md:px-10 pb-24">
      <div
        className="container-x relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl opacity-50" style={{ background: "var(--color-emerald)" }} />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl opacity-40" style={{ background: "var(--color-primary)" }} />
        <div className="relative">
          <Brain className="h-12 w-12 text-emerald mx-auto" />
          <h2 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
            Join the <span className="text-gradient-brand">future</span> of digital learning
          </h2>
          <p className="mt-5 text-white/70 max-w-xl mx-auto">
            Be part of a global movement leveraging education and advocacy to power
            sustainable change.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 justify-center">
            <a href="#" className="btn-primary">
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#courses" className="btn-ghost">
              <BookOpen className="h-4 w-4" /> Explore Courses
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- helpers -------------------- */
function SectionHeader({
  eyebrow, title, desc, dark,
}: { eyebrow: string; title: string; desc?: string; dark?: boolean }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${dark ? "text-emerald" : "text-primary"}`}>
        {eyebrow}
      </span>
      <h2 className={`mt-3 font-display text-4xl md:text-5xl font-bold leading-tight ${dark ? "" : ""}`}>
        {title}
      </h2>
      {desc && <p className={`mt-4 text-lg ${dark ? "text-white/65" : "text-muted-foreground"}`}>{desc}</p>}
    </div>
  );
}
