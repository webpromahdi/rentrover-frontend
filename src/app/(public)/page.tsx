import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
  Star,
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
} from "lucide-react";
import GearCard, { type GearCardItem } from "@/components/shared/GearCard";
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
    text: "Search thousands of verified gear items.",
  },
  {
    icon: CalendarDays,
    title: "Select Rental Dates",
    text: "Pick your start and end dates with our smart calendar.",
  },
  {
    icon: CircleDollarSign,
    title: "Confirm & Pay",
    text: "Secure checkout powered by Stripe.",
  },
  {
    icon: TentTree,
    title: "Pick Up & Adventure",
    text: "Collect your gear and head out!",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Providers",
    text: "Every provider is identity-verified and reviewed.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Rental Dates",
    text: "Rent for a day, a week, or longer.",
  },
  {
    icon: CircleDollarSign,
    title: "Secure Stripe Payments",
    text: "Bank-grade payment security on every transaction.",
  },
  {
    icon: CheckCircle2,
    title: "Damage Protection",
    text: "Optional damage cover for peace of mind.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "Our team is always here when you need help.",
  },
  {
    icon: ArrowRight,
    title: "Easy Returns",
    text: "Simple drop-off process at the provider location.",
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
    <main className="min-h-screen overflow-hidden bg-white text-foreground">
      {/* Hero*/}
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center bg-slate-900 bg-[url('https://i.ibb.co.com/Vp55rN0J/rentrover-bg.webp')] bg-cover bg-center px-5 py-20 text-center before:absolute before:inset-0 before:bg-slate-950/78"
      >
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="mx-auto inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold tracking-wide text-white sm:text-sm uppercase">
            Premier Equipment Rental Platform
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.07] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Access Premium Sports
            <br className="hidden sm:block" /> and Outdoor Gear
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Explore thousands of verified gear options from trusted providers. Book by the day and return when you are done. Experience top performance without the burden of ownership.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/gear">
                Browse Gear Now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-white bg-transparent text-white hover:bg-white hover:text-foreground"
            >
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 divide-x divide-y divide-white/20 border-white/20 text-left sm:grid-cols-4 sm:divide-y-0 sm:text-center">
            {[
              [`${stats.gearCount}+`, "Gear Items"],
              [`${stats.customerCount}+`, "Happy Customers"],
              [`${stats.providerCount}+`, "Verified Providers"],
              [`${stats.categoryCount}+`, "Categories"],
            ].map(([number, label]) => (
              <div key={label} className="px-4 py-4">
                <p className="text-2xl font-extrabold text-white">{number}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Browse by Category*/}
      <section id="categories" className="bg-muted px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Find your kit
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Browse by Category
            </h2>
          </div>

          {categories.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
              {categories.map((cat: PublicCategory) => {
                const Icon = CATEGORY_ICONS[cat.name] ?? Layers;
                return (
                  <Link
                    key={cat.id}
                    href={`/gear?category=${encodeURIComponent(cat.name)}`}
                    className="group flex min-h-36 flex-col items-center justify-center rounded-xl border border-transparent bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
                  >
                    <Icon
                      className="size-9 text-primary transition group-hover:scale-110"
                      strokeWidth={1.8}
                    />
                    <span className="mt-3 text-sm font-bold leading-5 text-foreground">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            // Fallback static categories if API fails
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
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
                  className="group flex min-h-36 flex-col items-center justify-center rounded-xl border border-transparent bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
                >
                  <Icon
                    className="size-9 text-primary transition group-hover:scale-110"
                    strokeWidth={1.8}
                  />
                  <span className="mt-3 text-sm font-bold leading-5 text-foreground">
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/*Top Gear This Week*/}
      <section id="featured-gear" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Popular right now
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Top Gear This Week
              </h2>
              <p className="mt-3 text-slate-500">
                Highest-rated gear from our verified providers.
              </p>
            </div>
            <Link
              href="/gear"
              className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline md:inline-flex"
            >
              View all gear <ChevronRight className="size-4" />
            </Link>
          </div>

          {topGears.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topGears.map((item) => (
                <GearCard key={item.id} item={toGearCardItem(item)} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
              <p className="text-lg font-bold text-slate-400">
                No gear available yet
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Check back soon for top-rated gear!
              </p>
            </div>
          )}

          <Button
            asChild
            variant="outline"
            size="xl"
            className="mx-auto mt-10 w-fit"
          >
            <Link href="/gear">
              View All Gear <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-900 px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary/70">
              The simple way
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Rent Gear in 4 Simple Steps
            </h2>
          </div>
          <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-5 before:absolute before:left-[12.5%] before:right-[12.5%] before:top-7 before:hidden before:border-t-2 before:border-dashed before:border-primary md:before:block">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="relative z-10 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border-4 border-[#1b2748] bg-primary text-lg font-extrabold">
                  {index + 1}
                </div>
                <Icon className="mx-auto mt-5 size-7 text-primary/70" />
                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <p className="mx-auto mt-2 max-w-56 text-sm leading-6 text-slate-300">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose RentRover*/}
      <section id="about-us" className="bg-muted px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Built for the outdoors
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why Thousands Choose RentRover
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
                In their words
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => {
                const initials = review.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <Card
                    key={review.id}
                    className="rounded-xl border border-border bg-white p-7 shadow-sm"
                  >
                    <p className="font-serif text-5xl leading-7 text-primary">
                      "
                    </p>
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-[#f4b740] text-[#f4b740]"
                        />
                      ))}
                    </div>
                    <p className="mt-5 leading-7 text-slate-600">
                      {review.comment}
                    </p>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-sm font-extrabold text-primary">
                        {initials}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {review.customer.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Rented: {review.gearItem.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        id="rent"
        className="relative overflow-hidden bg-primary px-5 py-20 text-center text-white"
      >
        <div className="absolute -left-12 top-0 size-64 rounded-full border-[28px] border-white/10" />
        <div className="absolute -right-16 -bottom-28 size-72 rotate-45 border-[34px] border-white/10" />
        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Rent Rover for Your Next Adventure?
          </h2>
          <p className="mt-4 text-lg text-red-100">
            Join 1,200+ adventurers who rent smart instead of buying.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-900"
          >
            Start Renting Today <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
