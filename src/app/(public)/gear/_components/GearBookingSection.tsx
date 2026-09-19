"use client";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, CalendarDays, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { createRentalOrderAction } from "@/app/(customer)/_actions/rentalActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GearBookingSection({
  pricePerDay,
  stock,
  gearId,
}: {
  pricePerDay: string;
  stock: number;
  gearId: string;
}) {
  const today = new Date().toISOString().split("T")[0];
  
  // By default set start and end date to today and 3 days from now
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 3);
  const defaultEndStr = defaultEndDate.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, diff);
  }, [startDate, endDate]);

  const price = parseInt(pricePerDay) || 0;
  const subtotal = price * days * quantity;
  // #2 — price-tick: key={subtotal} remounts the span on every value change,
  // retriggereing the CSS animation. No state, no effect, no extra re-render.

  const createOrderMutation = useMutation({
    mutationFn: () =>
      createRentalOrderAction({
        gearItemId: gearId,
        startDate,
        endDate,
        quantity,
      }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["public-gears"] });
      toast.success("Order created! Proceeding to payment...");
      router.push(`/dashboard/customer/rentals/${order.id}`);
    },
    onError: (error: Error) => {
      if (error.message === "Unauthorized") {
        router.push(`/login?redirectTo=${pathname}`);
      } else {
        toast.error(error.message || "Failed to create order");
      }
    },
  });

  const handleRentNow = () => {
    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }
    createOrderMutation.mutate();
  };

  return (
    <section className="rounded-xl bg-muted p-5">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
        <CalendarDays className="size-5 text-primary" />
        Select Your Rental Period
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="text-xs font-bold text-slate-600">
          Start Date
          <div className="relative mt-1.5">
            <Input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-foreground"
            />
          </div>
        </label>
        <label className="text-xs font-bold text-slate-600">
          End Date
          <div className="relative mt-1.5">
            <Input
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-foreground"
            />
          </div>
        </label>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">
          Quantity:
        </span>
        <div className="flex items-center rounded-lg border border-slate-200 bg-white">
          <Button 
            variant="ghost" 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center text-slate-500 hover:bg-slate-100 p-0"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm font-bold text-foreground">{quantity}</span>
          <Button 
            variant="ghost" 
            onClick={() => setQuantity(q => Math.min(stock, q + 1))}
            className="flex size-9 items-center justify-center text-primary hover:bg-primary/10 p-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <div className="my-5 border-t border-slate-200" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          Duration: <strong className="text-foreground">{days} day{days !== 1 ? 's' : ''}</strong>
        </span>
        {/* #2 — key={subtotal} remounts the span on value change → CSS animation retriggers */}
        <span key={subtotal} className="price-tick font-extrabold text-foreground">
          Subtotal: ${subtotal.toLocaleString()}
        </span>
      </div>
      <Button 
        disabled={createOrderMutation.isPending || days <= 0}
        onClick={handleRentNow}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-extrabold text-white hover:bg-primary/90 disabled:opacity-60">
        {createOrderMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ShoppingCart className="size-4" />
        )}
        {createOrderMutation.isPending ? "Processing..." : `Rent Now — $${subtotal.toLocaleString()}`}
      </Button>
      <Button className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-white text-sm font-bold text-primary hover:bg-primary/10">
        <Heart className="size-4" />
        Save to Wishlist
      </Button>
      <p className="mt-4 text-center text-xs font-medium text-slate-500">
        🔒 Secure payment via Stripe
      </p>
    </section>
  );
}
