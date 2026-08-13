"use client";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Package, Tag, Loader2 } from "lucide-react";
import { getPublicGearsAction } from "@/app/(customer)/_actions/gearActions";
import { createRentalOrderAction } from "@/app/(customer)/_actions/rentalActions";
import Image from "next/image";

const conditionColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  EXCELLENT: "bg-emerald-100 text-emerald-700",
  GOOD: "bg-green-100 text-green-700",
  FAIR: "bg-amber-100 text-amber-700",
  POOR: "bg-primary/20 text-red-700",
};

const BookingPage = () => {
  const router = useRouter();
  const params = useParams();
  const gearId = params.id as string;
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [quantity, setQuantity] = useState(1);

  // Fetch all public gears and find the one we need
  const { data: gearItems = [], isLoading } = useQuery({
    queryKey: ["public-gears"],
    queryFn: getPublicGearsAction,
  });

  const gear = gearItems.find((g) => g.id === gearId);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, diff);
  }, [startDate, endDate]);

  const pricePerDay = gear ? parseFloat(gear.pricePerDay) : 0;
  const subtotal = pricePerDay * days * quantity;

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
      toast.success("Order created! Proceeding to rental details.");
      router.push(`/dashboard/customer/rentals/${order.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }
    createOrderMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="p-6 sm:p-10">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <Package className="mb-4 size-12 text-slate-300" />
          <p className="text-lg font-bold text-slate-500">Gear not found.</p>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10">
      <PageHeading
        crumb={`Dashboard  ›  Rent Gear  ›  ${gear.name}`}
        title="Book This Gear"
      />

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        {/* Left: Gear Info */}
        <Card className="overflow-hidden p-0 border-none">
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image
              src={gear.image}
              alt={gear.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">
                  {gear.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {gear.brand}&nbsp;•&nbsp;{gear.category?.name}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${conditionColors[gear.condition] ?? "bg-slate-100 text-slate-600"}`}
              >
                {gear.condition}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-y-4 border-t border-border pt-5 text-sm">
              {gear.address && (
                <p className="col-span-2 flex items-center gap-2 text-slate-500">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {gear.address}
                </p>
              )}
              <p className="text-slate-500">
                Price per day
                <strong className="block pt-1 text-primary">
                  ${pricePerDay.toFixed(2)}
                </strong>
              </p>
              <p className="text-slate-500">
                Availability
                <strong className="block pt-1 text-emerald-600">
                  {gear.stock} in stock
                </strong>
              </p>
            </div>

            {gear.description && (
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                {gear.description}
              </p>
            )}
          </div>
        </Card>

        {/* Right: Booking Form */}
        <div className="space-y-4">
          <Card className="p-6 border-none">
            <h2 className="text-xl font-extrabold text-foreground">
              Select Rental Dates
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-foreground">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-foreground">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-foreground">
                  Quantity
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="number"
                    min={1}
                    max={gear.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Duration</span>
                  <span className="font-bold text-foreground">
                    {days} day{days !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Rate</span>
                  <span className="font-bold text-foreground">
                    ${pricePerDay.toFixed(2)} / day × {quantity}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-foreground">
                  <span>Total</span>
                  <span className="text-primary text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={createOrderMutation.isPending || days <= 0}
                className="h-12 w-full bg-primary font-extrabold hover:bg-primary/90 disabled:opacity-60"
              >
                {createOrderMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Creating Order...
                  </span>
                ) : (
                  `Confirm & Pay $${subtotal.toFixed(2)}`
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-4 border-none bg-amber-50 shadow-none text-sm text-amber-800">
            <p className="font-bold">💡 How it works</p>
            <ul className="mt-2 list-disc pl-4 space-y-1 leading-relaxed">
              <li>Select your dates and confirm the order</li>
              <li>You will be redirected to Stripe for secure payment</li>
              <li>After payment, your rental will be confirmed</li>
              <li>Full refund if cancelled 24 hours before start date</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
