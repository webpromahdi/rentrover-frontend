import {
  Star,
  User,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { getSingleGearAction } from "@/app/(customer)/_actions/gearActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GearBookingSection } from "../_components/GearBookingSection";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default async function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gear = await getSingleGearAction(id);

  if (!gear) {
    notFound();
  }

  const reviews = gear.reviews || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "0.0";
  const providerName = gear.provider?.name || "Unknown Provider";

  const specs = [
    ["Brand", gear.brand],
    ["Condition", gear.condition],
    ["Stock", `${gear.stock} units left`],
    ["Address", gear.address || "Dhaka, Bangladesh"],
    ["Category", gear.category?.name || "Uncategorized"],
  ];

  // rating percentages
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
      <div className="mb-6 text-sm text-slate-500">
        <Link
          href="/gear"
          className="font-semibold text-primary hover:underline"
        >
          Browse Gear
        </Link>
        <span className="mx-2">/</span>
        <span>{gear.name}</span>
      </div>
      <section className="grid gap-9 lg:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200">
            <Image
              src={gear.image}
              alt={gear.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[gear.image, gear.image, gear.image].map((src, index) => (
              <button
                key={index}
                className={`relative aspect-[4/3] p-0 overflow-hidden rounded-lg border-2 ${index === 0 ? "border-primary" : "border-transparent"}`}
              >
                <Image
                  src={src}
                  alt={`${gear.name} preview ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 33vw, 20vw"
                  className="object-cover opacity-80 transition hover:opacity-100"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <Badge variant="default" size="categoryLg">
            {gear.category?.name || "Gear"}
          </Badge>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-foreground sm:text-4xl">
            {gear.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`size-4 ${index < Math.round(Number(avgRating)) ? "fill-[#f4b740] text-[#f4b740]" : "text-slate-300"}`}
                />
              ))}
            </span>
            <strong>{avgRating}</strong>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{totalReviews} reviews</span>
            <a
              href="#reviews"
              className="font-semibold text-blue-600 hover:underline"
            >
              Read all reviews
            </a>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-blue-100 text-sm font-extrabold uppercase text-blue-700">
                {getInitials(providerName)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-slate-600">
              Listed by{" "}
              <strong className="text-foreground">{providerName}</strong>{" "}
              <span className="mx-1 text-slate-300">|</span>{" "}
              <Star className="mb-0.5 inline size-3.5 fill-[#f4b740] text-[#f4b740]" />{" "}
              Provider
            </p>
          </div>
          <div className="my-6 border-t border-slate-200" />
          <div className="flex items-end gap-3">
            <p className="text-4xl font-extrabold tracking-[-0.04em] text-primary">
              ${gear.pricePerDay}
              <span className="text-lg font-bold">/day</span>
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <Badge variant="colorEmerald" size="infoLg">
              Condition: {gear.condition}
            </Badge>
            <Badge variant="colorAmber" size="infoLg">
              Stock: {gear.stock} units left
            </Badge>
            {gear.availability ? (
              <Badge variant="colorGreen" size="infoLg">
                ✓ Available
              </Badge>
            ) : (
              <Badge variant="colorRed" size="infoLg">
                ✗ Out of Stock
              </Badge>
            )}
          </div>
          <p className="mt-6 leading-7 text-slate-600">
            {gear.description ||
              `Rent the ${gear.name} today. Excellent for all your needs. Listed by a verified provider on RentRover.`}
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 text-sm">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-2 border-b border-slate-200 last:border-0"
              >
                <span className="bg-slate-50 px-4 py-3 font-bold text-foreground">
                  {label}
                </span>
                <span className="px-4 py-3 text-slate-600">{value}</span>
              </div>
            ))}
          </div>
          <div className="my-6 border-t border-slate-200" />
          <GearBookingSection 
            pricePerDay={gear.pricePerDay} 
            stock={gear.stock} 
            gearId={gear.id} 
          />
        </div>
      </section>

      <section id="reviews" className="mt-16 border-t border-slate-200 pt-10">
        <div className="flex gap-6 overflow-x-auto scrollbar-none border-b border-slate-200">
          <a
            href="#reviews"
            className="whitespace-nowrap border-b-2 border-primary pb-4 text-sm font-extrabold text-primary"
          >
            Reviews ({totalReviews})
          </a>
          <a
            href="#provider"
            className="whitespace-nowrap border-b-2 border-transparent pb-4 text-sm font-bold text-slate-500"
          >
            Provider Info
          </a>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="space-y-6">
            {/* Rating Box */}
            <div className="rounded-xl bg-muted p-6 text-center">
              <p className="text-5xl font-extrabold text-foreground">
                {avgRating}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                out of 5
              </p>
              <div className="mt-3 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`size-4 ${index < Math.round(Number(avgRating)) ? "fill-[#f4b740] text-[#f4b740]" : "text-slate-300"}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Based on {totalReviews} reviews
              </p>
              <div className="mt-6 space-y-2 text-xs">
                {[5, 4, 3, 2, 1].map((score) => {
                  const count = ratingCounts[score - 1];
                  const percent =
                    totalReviews > 0
                      ? Math.round((count / totalReviews) * 100)
                      : 0;
                  return (
                    <div key={score} className="flex items-center gap-2">
                      <span className="w-5 text-right">{score}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#f4b740]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-7">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Provider Info Box */}
            {gear.provider && (
              <div
                id="provider"
                className="rounded-xl border border-slate-200 p-6"
              >
                <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-foreground">
                  Provider Info
                </h3>
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-extrabold uppercase text-blue-700">
                    {providerName.substring(0, 2)}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{providerName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Verified Provider
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-slate-400" />
                    <a
                      href={`mailto:${gear.provider.email}`}
                      className="hover:underline"
                    >
                      {gear.provider.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-slate-400" />
                    <span>Member since 2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card className="rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                No reviews yet for this gear.
              </Card>
            ) : (
              reviews.map((r) => {
                const customerName = r.customer?.name || "Anonymous";
                const initials = customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();
                const dateStr = new Date(r.createdAt).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "short", day: "numeric" },
                );

                return (
                  <Card
                    key={r.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-bold text-foreground">
                            {customerName}
                          </p>
                          <p className="text-xs text-slate-400">{dateStr}</p>
                        </div>
                        <div className="mt-1 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`size-3.5 ${index < r.rating ? "fill-[#f4b740] text-[#f4b740]" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {r.comment || "No comment provided."}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              More to explore
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.025em] text-foreground">
              You Might Also Like
            </h2>
          </div>
          <Button
            render={<Link href="/gear" />}
            variant="link"
            className="hidden px-0 sm:block"
          >
            View all gear →
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"></div>
      </section>
    </main>
  );
}
