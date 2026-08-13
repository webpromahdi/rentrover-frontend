import {
  Bike,
  Mountain,
  Phone,
  Mail,
  Check,
  Circle,
  CircleX,
} from "lucide-react";
import PageHeading from "@/components/shared/PageHeading";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const ProviderOrderDetailsPage = () => {
  const timeline = [
    "PLACED",
    "CONFIRMED",
    "PAID",
    "PICKED_UP",
    "RETURNED",
    "CANCELLED",
  ];
  return (
    <div className="p-5 sm:p-8">
      <PageHeading
        crumb="Dashboard  ›  Orders  ›  Order #ORD-001"
        title="Order Details"
      />
      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <Card className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=900&auto=format&fit=crop&q=85"
              alt="Trek mountain bike"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">
                Trek X-Caliber Mountain Bike
              </h2>
              <p className="mt-1 text-sm text-slate-500">Trek · Cycling</p>
            </div>
            <StatusBadge status="PLACED" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5 text-sm">
            <p className="text-slate-500">
              Rental
              <strong className="block pt-1 text-foreground">
                Jul 15 – Jul 18, 2025
              </strong>
            </p>
            <p className="text-slate-500">
              Duration
              <strong className="block pt-1 text-foreground">
                3 days · Qty: 1
              </strong>
            </p>
            <p className="text-slate-500">
              Total
              <strong className="block pt-1 text-xl text-primary">
                $75.00
              </strong>
            </p>
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 p-4">
            <p className="font-bold text-amber-800">
              ⚠️ This order is awaiting your confirmation.
            </p>
            <Button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/90">
              <Check className="size-4" />
              Confirm Order
            </Button>
            <Button className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-white text-sm font-bold text-primary transition-colors hover:bg-primary/10">
              <CircleX className="size-4" />
              Cancel Order
            </Button>
          </div>
        </Card>
        <Card className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-blue-100 font-extrabold text-blue-700">
              JD
            </span>
            <div>
              <h2 className="font-extrabold text-foreground">John Doe</h2>
              <p className="text-sm text-slate-500">Customer since Jan 2025</p>
            </div>
          </div>
          <div className="my-6 border-t border-border" />
          <p className="flex gap-2 text-sm text-slate-600">
            <Mail className="size-4 text-primary" />
            johndoe@email.com
          </p>
          <p className="mt-3 flex gap-2 text-sm text-slate-600">
            <Phone className="size-4 text-primary" />
            +880 1700-999000
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">
              Total orders
              <strong className="mt-1 block text-lg text-foreground">3</strong>
            </p>
            <p className="text-xs text-slate-500">
              Rating
              <strong className="mt-1 block text-lg text-foreground">
                ⭐ 5.0
              </strong>
            </p>
          </div>
          <Button className="mt-5 flex h-11 w-full items-center justify-center rounded-lg border border-primary bg-white text-sm font-bold text-primary transition-colors hover:bg-primary/10">
            Send Message
          </Button>
        </Card>
      </div>
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h2 className="text-xl font-extrabold text-foreground">
          Order Progress
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-y-7 md:grid-cols-6">
          {timeline.map((step, index) => (
            <div
              key={step}
              className="relative text-center before:absolute before:left-1/2 before:top-5 before:hidden before:h-0.5 before:w-full before:bg-slate-200 md:before:block first:before:hidden"
            >
              <span
                className={`relative z-10 mx-auto flex size-10 items-center justify-center rounded-full ${index === 0 ? "border-4 border-amber-200 bg-amber-500 text-white" : "border-2 border-slate-300 bg-white text-slate-400"}`}
              >
                {index === 0 ? (
                  <Circle className="size-3 fill-white" />
                ) : (
                  <Circle className="size-3" />
                )}
              </span>
              <p
                className={`mt-3 text-xs font-extrabold ${step === "CANCELLED" ? "text-slate-400 line-through" : "text-foreground"}`}
              >
                {step.replaceAll("_", " ")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderOrderDetailsPage;
