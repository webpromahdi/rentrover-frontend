import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/LinkButton";
import { Badge } from "@/components/ui/badge";

export type GearCardItem = {
  id: string;
  name: string;
  brand: string;
  pricePerDay: string | number;
  condition: "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  availability?: boolean;
  image: string;
  category: string | { name: string };
  avgRating?: number;
  reviewCount?: number;
};

const conditionColor: Record<GearCardItem["condition"], string> = {
  NEW: "bg-emerald-600",
  EXCELLENT: "bg-blue-600",
  GOOD: "bg-amber-600",
  FAIR: "bg-orange-600",
  POOR: "bg-slate-500",
};

export default function GearCard({ item }: { item: GearCardItem }) {
  const categoryName =
    typeof item.category === "string" ? item.category : item.category.name;

  const price =
    typeof item.pricePerDay === "string"
      ? parseFloat(item.pricePerDay)
      : item.pricePerDay;

  const rating = item.avgRating ?? 0;
  const reviews = item.reviewCount ?? 0;
  const isAvailable = item.availability !== false;

  return (
    <Card className="group overflow-hidden p-0 border-border shadow-blue-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-blue hover:border-primary/20">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
        />
        <Badge variant="default" size="category" className="absolute left-3 top-3">
          {categoryName.toUpperCase()}
        </Badge>
        <Badge
          variant="condition"
          size="conditionCard"
          className="absolute right-3 top-3"
        >
          {item.condition}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="truncate text-base font-semibold text-foreground">
          {item.name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-slate-400">{item.brand}</p>

        {reviews > 0 ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{rating.toFixed(1)}</span>
            <span className="text-slate-400">· {reviews} reviews</span>
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-400">No reviews yet</div>
        )}

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xl font-bold tabular-nums text-primary">
              ${price.toLocaleString()}
              <span className="text-sm font-medium text-slate-500">/day</span>
            </p>
          </div>
          {isAvailable ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span className="size-2 rounded-full bg-slate-300" />
              Unavailable
            </span>
          )}
        </div>

        <LinkButton
          href={`/gear/${item.id}`}
          size="lg"
          className="mt-5 w-full hover:bg-[#1D4ED8] active:scale-[0.98]"
        >
          Rent Now
        </LinkButton>
      </div>
    </Card>
  );
}
