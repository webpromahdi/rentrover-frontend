import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/shared/LinkButton";
import {
  ArrowRight,
  ChevronRight,
  Star,
  Compass,
  TentTree,
  Bike,
  Waves,
  Snowflake,
  Dumbbell,
  Trophy,
  Mountain,
  Camera,
  Layers,
  Search,
  CalendarDays,
  CircleDollarSign,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Sparkles,
} from "lucide-react";
import GearCard, { type GearCardItem } from "@/components/shared/GearCard";
import { StatsCounter } from "@/components/shared/StatsCounter";
import { Card } from "@/components/ui/card";
import {
  getPublicCategoriesAction,
  getTopGearsAction,
  getPublicReviewsAction,
  getPlatformStatsAction,
  type PublicCategory,
  type PublicGear,
  type PublicReview,
} from "./_actions/homeActions";

const steps = [
  {
    icon: Search,
    title: "Browse & Filter",
    text: "Search thousands of verified gear items tailored to your exact adventure needs.",
  },
  {
    icon: CalendarDays,
    title: "Select Rental Dates",
    text: "Pick your start and end dates effortlessly with our smart availability calendar.",
  },
  {
    icon: CircleDollarSign,
    title: "Confirm & Pay",
    text: "Secure checkout powered by Stripe with instant booking confirmation.",
  },
  {
    icon: TentTree,
    title: "Pick Up & Adventure",
    text: "Collect your gear from verified local providers and head straight into nature!",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Providers",
    text: "Every provider undergoes rigorous identity verification and community review.",
    className: "md:col-span-2",
  },
  {
    icon: CalendarDays,
    title: "Flexible Rental Dates",
    text: "Rent for a single day, an entire weekend, or weeks on end.",
    className: "md:col-span-1",
  },
  {
    icon: CircleDollarSign,
    title: "Secure Stripe Payments",
    text: "Bank-grade encryption on every transaction for absolute peace of mind.",
    className: "md:col-span-1",
  },
  {
    icon: CheckCircle2,
    title: "Damage Protection",
    text: "Comprehensive optional damage cover so you can explore worry-free.",
    className: "md:col-span-1",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    text: "Our dedicated support team is always on standby whenever you need assistance.",
    className: "md:col-span-1",
  },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Camping & Hiking": TentTree,
  Camping: TentTree,
  Hiking: Mountain,
  Cycling: Bike,
  "Water Sports": Waves,
  "Winter Sports": Snowflake,
  "Fitness & Gym": Dumbbell,
  Fitness: Dumbbell,
  Gym: Dumbbell,
  "Team Sports": Trophy,
  "Rock Climbing": Mountain,
  "Photography Gear": Camera,
  Photography: Camera,
};

function toGearCardItem(g: PublicGear): GearCardItem {
  const reviews = g.reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return {
    id: g.id,
    name: g.name,
    brand: g.brand,
    pricePerDay: g.pricePerDay,
    condition: g.condition,
    availability: g.availability,
    image: g.image,
    category: g.category,
    avgRating,
    reviewCount: reviews.length,
  };
}

export default async function HomePage() {
  const [categories, topGears, reviews, stats] = await Promise.all([
    getPublicCategoriesAction(),
    getTopGearsAction(8),
    getPublicReviewsAction(6),
    getPlatformStatsAction(),
  ]);

  return (
    <main className="min-h-screen bg-white text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-slate-950 bg-[url('https://i.ibb.co.com/Vp55rN0J/rentrover-bg.webp')] bg-cover bg-center py-24 lg:py-36 text-white before:absolute before:inset-0 before:bg-slate-950/80"
      >
        <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 right-0 size-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-xs font-semibold tracking-wide text-primary-foreground backdrop-blur-md sm:text-sm mb-6">
            <Sparkles className="size-4 text-primary" />
            <span>Premier Equipment Rental Platform</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight leading-[1.08] sm:text-6xl lg:text-7xl">
            Access Premium Sports <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              & Outdoor Gear
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
            Explore thousands of verified gear options from trusted local providers. Book by the day, adventure without limits, and skip the financial burden of ownership.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="/gear" size="xl" className="shadow-lg shadow-primary/25 [@media(hover:hover)and(pointer:fine)]:hover:shadow-primary/40 transition-[box-shadow]">
              Browse Gear Now <ArrowRight className="size-4 ml-1" />
            </LinkButton>
            <LinkButton
              href="#how-it-works"
              variant="outline"
              size="xl"
              className="border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white backdrop-blur-sm"
            >
              How It Works
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* StatsCounter is a client component — owns the count-up animation and
            IntersectionObserver. page.tsx stays a pure Server Component. */}
        <StatsCounter
          items={[
            { label: "Verified Gear",    target: stats.gearCount,      sub: "Top condition items" },
            { label: "Active Renters",   target: stats.customerCount,  sub: "Satisfied explorers" },
            { label: "Trusted Partners", target: stats.providerCount,  sub: "Verified providers" },
            { label: "Gear Categories",  target: stats.categoryCount,  sub: "Sports & outdoors" },
          ]}
        />
      </section>

      {/* Refined Categories Grid */}
      <section id="categories" className="py-24 bg-slate-50 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
                Find your kit
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/gear"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition"
            >
              Explore all categories <ChevronRight className="size-4" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat: PublicCategory) => {
                const Icon = CATEGORY_ICONS[cat.name] ?? Layers;
                return (
                  <Link
                    key={cat.id}
                    href={`/gear?category=${encodeURIComponent(cat.name)}`}
                    className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs transition-[transform,box-shadow,border-color] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)and(pointer:fine)]:hover:-translate-y-1.5 [@media(hover:hover)and(pointer:fine)]:hover:border-primary/50 [@media(hover:hover)and(pointer:fine)]:hover:shadow-xl [@media(hover:hover)and(pointer:fine)]:hover:shadow-primary/5"
                  >
                    <div className="size-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary transition-[transform,background-color,color] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)and(pointer:fine)]:group-hover:bg-primary [@media(hover:hover)and(pointer:fine)]:group-hover:text-white [@media(hover:hover)and(pointer:fine)]:group-hover:scale-[1.05] shadow-inner">
                      <Icon className="size-8" strokeWidth={1.8} />
                    </div>
                    <span className="mt-5 text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                    <span className="mt-1 text-xs text-slate-400 group-hover:text-slate-600">
                      Browse gear &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[
                { name: "Camping & Hiking", Icon: TentTree },
                { name: "Cycling", Icon: Bike },
                { name: "Water Sports", Icon: Waves },
                { name: "Winter Sports", Icon: Snowflake },
                { name: "Fitness & Gym", Icon: Dumbbell },
                { name: "Team Sports", Icon: Trophy },
                { name: "Rock Climbing", Icon: Mountain },
                { name: "Photography", Icon: Camera },
              ].map(({ name, Icon }) => (
                <Link
                  key={name}
                  href={`/gear?category=${encodeURIComponent(name)}`}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs transition-[transform,box-shadow,border-color] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)and(pointer:fine)]:hover:-translate-y-1.5 [@media(hover:hover)and(pointer:fine)]:hover:border-primary/50 [@media(hover:hover)and(pointer:fine)]:hover:shadow-xl [@media(hover:hover)and(pointer:fine)]:hover:shadow-primary/5"
                >
                  <div className="size-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary transition-[transform,background-color,color] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)and(pointer:fine)]:group-hover:bg-primary [@media(hover:hover)and(pointer:fine)]:group-hover:text-white [@media(hover:hover)and(pointer:fine)]:group-hover:scale-[1.05] shadow-inner">
                    <Icon className="size-8" strokeWidth={1.8} />
                  </div>
                  <span className="mt-5 text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {name}
                  </span>
                  <span className="mt-1 text-xs text-slate-400 group-hover:text-slate-600">
                    Browse gear &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Gear This Week */}
      <section id="featured-gear" className="py-24 px-5 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
                Popular right now
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Top Gear This Week
              </h2>
              <p className="mt-2 text-slate-500">
                Highest-rated equipment from our community of verified providers.
              </p>
            </div>
            <Link
              href="/gear"
              className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
            >
              View all gear <ChevronRight className="size-4" />
            </Link>
          </div>

          {topGears.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topGears.map((item, index) => (
                <GearCard key={item.id} item={toGearCardItem(item)} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <p className="text-lg font-bold text-slate-400">No gear available yet</p>
              <p className="mt-2 text-sm text-slate-400">Check back soon for top-rated gear!</p>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <LinkButton href="/gear" variant="outline" size="xl" className="w-full">
              View All Gear <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Staggered Timeline for How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
              Seamless process
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Rent Gear in 4 Simple Steps
            </h2>
            <p className="mt-3 text-slate-400">
              Getting equipped for your next great adventure has never been this effortless.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className={`relative rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-md flex flex-col justify-between transition hover:border-primary/50 hover:bg-slate-900 ${
                  index % 2 === 1 ? "lg:translate-y-8" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                      <Icon className="size-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-700">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{text}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-primary">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="size-3.5 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Benefits */}
      <section id="about-us" className="py-24 bg-slate-50 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
              Built for outdoors
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Why Thousands Choose RentRover
            </h2>
            <p className="mt-3 text-slate-500">
              Everything you need for a frictionless, trustworthy, and secure equipment rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, text, className }, index) => (
              <Card
                key={title}
                className={`rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-xl hover:border-primary/40 flex flex-col justify-between ${
                  className ?? ""
                }`}
              >
                <div>
                  <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>RentRover Guarantee</span>
                  <span className="text-primary font-bold">Verified &bull; 0{index + 1}</span>
                </div>
              </Card>
            ))}
            {/* Ready to Explore Full-Width CTA Card */}
            <div className="relative overflow-hidden col-span-full md:col-span-3 rounded-3xl bg-slate-950 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-900/30 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.25),0_10px_25px_-10px_rgba(15,23,42,0.8)]">
              {/* Background Image on Right (Restricted width to zoom out, blended by the gradient) */}
              <div
                className="absolute right-0 top-0 bottom-0 w-full md:w-[70%] lg:w-[60%] bg-cover bg-right bg-no-repeat pointer-events-none"
                style={{
                  backgroundImage: `url('https://i.ibb.co.com/4Zh8gJWW/Provider-handing-over-gear.png')`,
                }}
              />

              {/* Dark gradient overlay & subtle RentRover blue glow: darker on left for content, blending naturally to image on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/35 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden pointer-events-none" />
              <div className="absolute -left-16 -top-16 size-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  Ready to explore?
                </span>
                <h3 className="text-2xl font-black">List your own gear & earn extra income</h3>
                <p className="text-slate-300 text-sm mt-2 max-w-xl">
                  Turn your idle camping gear, skis, or bikes into a revenue stream when you are not using them.
                </p>
              </div>
              <LinkButton href="/register" size="lg" className="relative z-10 shrink-0 shadow-lg shadow-primary/25">
                Become a Provider <ArrowRight className="size-4 ml-1" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Masonry Testimonials */}
      {reviews.length > 0 && (
        <section className="py-24 bg-white px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
                In their words
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="mt-3 text-slate-500">
                Real experiences from adventurers across the globe.
              </p>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {reviews.map((review) => {
                const initials = review.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <div key={review.id} className="break-inside-avoid">
                    <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
                      {/* Stars are decorative — aria-label on wrapper communicates the rating */}
                      <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                        ))}
                      </div>
                      <p className="text-slate-700 leading-relaxed italic text-base line-clamp-4">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4">
                        <span className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-base shrink-0">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{review.customer.name}</p>
                          <p className="text-xs text-slate-400 truncate">Rented: {review.gearItem.name}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Premium CTA - Redesigned 2-Column Layout */}
      <section
        id="rent"
        className="relative overflow-hidden bg-slate-950 py-16 lg:py-20 px-5 text-white border-t border-slate-900"
      >
        {/* Subtle glowing radial background accents for premium feel */}
        <div className="absolute -left-40 top-0 size-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 size-[400px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <div className="max-w-xl lg:pr-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              Start your journey today
            </span>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-5xl leading-[1.15]">
              Ready for Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Outdoor Adventure?</span>
            </h2>
            <p className="mt-6 text-lg text-slate-400 font-normal leading-relaxed">
              Join thousands of adventurers who rent premium gear instead of buying. Experience top performance without the burden of ownership.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-extrabold text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-[transform,background-color] duration-150 hover:bg-blue-700 [@media(hover:hover)and(pointer:fine)]:hover:scale-[1.02]"
              >
                Start Renting Today <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/gear"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Browse All Gear
              </Link>
            </div>
          </div>

          {/* Right Column: Trust & Experience Collage */}
          <div className="relative w-full h-[350px] lg:h-[450px] hidden md:block lg:ml-auto lg:w-[90%]">
            {/* Main high-quality image */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
              <Image 
                src="https://i.ibb.co.com/3tkn0q0/Chat-GPT-Image-Sep-19-2026-11-03-05-AM.png" 
                alt="Outdoor adventure camping"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Glassmorphism Card 1: 5-Star Rating */}
            <div className="absolute bottom-8 -left-8 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-4 hover:-translate-y-1 transition-transform duration-500 cursor-default">
              <div className="flex -space-x-3">
                {[
                  "https://i.ibb.co.com/7J2wTsL0/photo-1534528741775-53994a69daeb.avif",
                  "https://i.ibb.co.com/zT7pP6Xb/photo-1506794778202-cad84cf45f1d.avif",
                  "https://i.ibb.co.com/Hfcw9P0X/photo-1494790108377-be9c29b29330.avif",
                  "https://i.ibb.co.com/jP5JPHC2/photo-1507003211169-0a1dd7228f2d.avif"
                ].map((url, i) => (
                  <div key={i} className="size-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800 relative">
                    <Image src={url} alt="User" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                </div>
                <p className="text-xs font-bold text-white">4.9/5 from 10k+ users</p>
              </div>
            </div>

            {/* Floating Glassmorphism Card 2: Gear Availability */}
            <div className="absolute top-12 -right-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-3 shadow-2xl flex items-center gap-3 hover:-translate-y-1 transition-transform duration-500 cursor-default">
              <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Compass className="size-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-0.5">Available Now</p>
                <p className="text-xs font-bold text-white">5,000+ Premium Items</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
