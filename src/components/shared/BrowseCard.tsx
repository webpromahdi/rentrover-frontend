import { Star } from "lucide-react";
import { Card } from "../ui/card";

import Link from "next/link";
import Image from "next/image";

export default function BrowseCard({
  item,
}: {
  item: any; // We'll use any here temporarily since the type is mixed between old static and new dynamic data
}) {
  const conditionClass =
    item.condition === "NEW"
      ? "bg-emerald-600"
      : item.condition === "GOOD"
        ? "bg-amber-600"
        : "bg-blue-600";
  return (
    <Card className="group overflow-hidden p-0 gap-0 border-0 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(20,29,52,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white">
          {typeof item.category === "string" ? item.category.toUpperCase() : item.category?.name?.toUpperCase() || "GEAR"}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white ${conditionClass}`}
        >
          {item.condition}
        </span>
      </div>
      <div className="p-5">
        <h3 className="truncate text-lg font-bold text-foreground">
          {item.name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-slate-500">
          {item.brand}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
          <Star className="size-4 fill-[#f4b740] text-[#f4b740]" />
          <span className="font-semibold text-slate-700">{item.rating}</span>
          <span>· {item.reviews} {item.reviews === 1 ? 'review' : 'reviews'}</span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-xl font-extrabold text-primary">
            ${item.pricePerDay || item.price}
            <span className="text-sm font-medium">/day</span>
          </p>
          {item.availability !== false ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <i className="size-2 rounded-full bg-emerald-500" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-700">
              <i className="size-2 rounded-full bg-primary/100" />
              Unavailable
            </span>
          )}
        </div>
        <Link
          href={`/gear/${item.id}`}
          className="mt-5 flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white hover:bg-primary/90"
        >
          Rent Now
        </Link>
      </div>
    </Card>
  );
}
