"use client";
import { useGearFilters } from "@/app/hooks/useGearFilters";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

type PublicCategory = {
  id: string;
  name: string;
};

export function GearFilters({
  categories,
  hideApplyButton,
}: {
  categories: PublicCategory[];
  hideApplyButton?: boolean;
}) {
  const {
    maxPrice,
    setMaxPrice,
    selectedCategories,
    selectedConditions,
    isAvailableOnly,
    handleCategoryChange,
    handleConditionChange,
    toggleAvailableOnly,
  } = useGearFilters();

  return (
    <div className="space-y-8 mt-2">
      <details className="group pt-1" open>
        <summary className="flex cursor-pointer items-center justify-between text-sm font-extrabold text-foreground list-none [&::-webkit-details-marker]:hidden">
          Category
          <ChevronDown className="size-4 text-foreground transition-transform group-open:hidden" />
          <ChevronUp className="size-4 text-foreground hidden transition-transform group-open:block" />
        </summary>
        <div className="mt-6 space-y-5">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center justify-between text-sm text-slate-600"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked as boolean)
                  }
                  className="size-4 rounded border-slate-300 accent-[#e31824]"
                />
                <span>{category.name}</span>
              </div>
            </label>
          ))}
        </div>
      </details>

      <details className="group pt-1" open>
        <summary className="flex cursor-pointer items-center justify-between text-sm font-extrabold text-foreground list-none [&::-webkit-details-marker]:hidden">
          Max Price Per Day
          <ChevronDown className="size-4 text-foreground transition-transform group-open:hidden" />
          <ChevronUp className="size-4 text-foreground hidden transition-transform group-open:block" />
        </summary>
        <div className="pt-6">
          <Slider
            value={maxPrice}
            onValueChange={(val) => setMaxPrice(val as number[])}
            max={1000}
            step={10}
            className="mt-2"
          />
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="rounded-md bg-primary/10 px-2.5 py-1.5 text-primary">
              $0
            </span>
            <span>
              Up to ${maxPrice[0]}
              {maxPrice[0] === 1000 ? "+" : ""}/day
            </span>
            <span className="rounded-md bg-primary/10 px-2.5 py-1.5 text-primary">
              $1000+
            </span>
          </div>
        </div>
      </details>

      <details className="group pt-1" open>
        <summary className="flex cursor-pointer items-center justify-between text-sm font-extrabold text-foreground list-none [&::-webkit-details-marker]:hidden">
          Condition
          <ChevronDown className="size-4 text-foreground transition-transform group-open:hidden" />
          <ChevronUp className="size-4 text-foreground hidden transition-transform group-open:block" />
        </summary>
        <div className="mt-6 space-y-5">
          {["NEW", "EXCELLENT", "GOOD", "FAIR"].map((condition) => (
            <label
              key={condition}
              className="flex cursor-pointer items-center justify-between text-sm text-slate-600 capitalize"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={(checked) =>
                    handleConditionChange(condition, checked as boolean)
                  }
                  className="size-4 rounded border-slate-300 accent-[#e31824]"
                />
                <span>{condition.toLowerCase()}</span>
              </div>
            </label>
          ))}
        </div>
      </details>

      <div className="flex items-center justify-between pt-1 pb-4">
        <span className="text-sm font-extrabold text-foreground">
          Show Available Only
        </span>
        <button
          onClick={toggleAvailableOnly}
          aria-label="Show available gear only"
          className={`relative h-6 w-11 rounded-full transition ${
            isAvailableOnly ? "bg-primary" : "bg-slate-300"
          }`}
        >
          <i
            className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${
              isAvailableOnly ? "right-1" : "left-1"
            }`}
          />
        </button>
      </div>

      {!hideApplyButton && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-primary/90"
        >
          <Filter className="size-4" />
          View Results
        </button>
      )}
    </div>
  );
}
