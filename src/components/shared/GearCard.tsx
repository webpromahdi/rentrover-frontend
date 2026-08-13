import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="group p-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(20,29,52,0.15)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition duration-500 group-hover:scale-105"
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
        <h3 className="truncate text-lg font-bold text-foreground">
          {item.name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-slate-500">{item.brand}</p>

        {reviews > 0 ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
            <Star className="size-4 fill-[#f4b740] text-[#f4b740]" />
            <span className="font-semibold text-slate-700">
              {rating.toFixed(1)}
            </span>
            <span>· {reviews} reviews</span>
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-400">No reviews yet</div>
        )}

        <div className="mt-4 flex items-end justify-between">
          <p className="text-xl font-extrabold text-primary">
            ${price.toLocaleString()}
            <span className="text-sm font-medium">/day</span>
          </p>
          {isAvailable ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <i className="size-2 rounded-full bg-emerald-500" />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <i className="size-2 rounded-full bg-slate-400" />
              Unavailable
            </span>
          )}
        </div>

        <Button
          render={<Link href={`/gear/${item.id}`} />}
          size="lg"
          className="mt-5 w-full"
        >
          Rent Now
        </Button>
      </div>
    </Card>
  );
}
