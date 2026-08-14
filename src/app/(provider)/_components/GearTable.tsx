"use client";
import { Trash2, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getProviderGearAction,
  deleteProviderGearAction,
} from "../_actions/gearActions";
import ConditionBadge from "@/components/shared/ConditionBadge";
import Availability from "@/components/shared/Availability";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import Image from "next/image";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export type GearItem = {
  id: string;
  name: string;
  brand: string;
  category?: { name: string } | string;
  categoryId?: string;
  pricePerDay: number;
  stock: number;
  condition: string;
  availability?: boolean;
  active?: boolean;
  image?: string;
};

const GearTable = ({
  short = false,
  items,
  startIndex = 0,
}: {
  short?: boolean;
  items?: GearItem[];
  startIndex?: number;
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["provider-gear"],
    queryFn: getProviderGearAction,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProviderGearAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
      toast.success("Gear deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete gear");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gear?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="border-b border-border bg-slate-50/50 p-4">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-red-500">
        Failed to load gear.
      </div>
    );
  }

  const gearData = items
    ? items
    : Array.isArray(data?.data?.gearItems)
      ? data.data.gearItems
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
  const rows = short ? gearData.slice(0, 4) : gearData;

  return (
    <div
      className={`overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
        !short ? "min-h-[445px]" : ""
      }`}
    >
      <Table className="min-w-[1000px] w-full text-left text-sm">
        <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <TableRow className="hover:bg-transparent">
            {(short
              ? [
                  "Thumb",
                  "Gear Name",
                  "Category",
                  "Price/Day",
                  "Stock",
                  "Condition",
                  "Available",
                  "Actions",
                ]
              : [
                  "#",
                  "Image",
                  "Name",
                  "Brand",
                  "Category",
                  "Price/Day",
                  "Stock",
                  "Condition",
                  "Available",
                  "Actions",
                ]
            ).map((x) => (
              <TableHead key={x} className="px-5 py-3.5">
                {x}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="p-8">
                <EmptyState
                  icon={Inbox}
                  title="No gear found"
                  description="You haven't added any gear yet. Add some gear to get started!"
                  action={
                    <Button asChild size="sm">
                      <Link href="/dashboard/provider/gear/new">Add New Gear</Link>
                    </Button>
                  }
                  className="min-h-[250px] border-none bg-transparent"
                />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((gear: GearItem, index: number) => (
              <TableRow
                key={gear.id || index}
                className="border-b border-border last:border-0 hover:bg-slate-50/50"
              >
                <TableCell className="px-5 py-4">
                  {short ? (
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={gear.image || "https://placehold.co/400"}
                        alt={gear.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-500">
                      {startIndex + index + 1}
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4">
                  {short ? (
                    <span className="font-bold text-foreground">
                      {gear.name}
                    </span>
                  ) : (
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={gear.image || "https://placehold.co/400"}
                        alt={gear.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </TableCell>
                {!short && (
                  <TableCell className="px-5 py-4 text-[13px] font-bold text-foreground">
                    {gear.name}
                  </TableCell>
                )}
                {!short && (
                  <TableCell className="px-5 py-4 text-[13px] text-slate-600">
                    {gear.brand}
                  </TableCell>
                )}
                <TableCell className="px-5 py-4 text-[13px] text-slate-600">
                  {typeof gear.category === "object"
                    ? gear.category?.name
                    : gear.category || gear.categoryId}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-bold text-foreground">
                  ${gear.pricePerDay}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                  {gear.stock}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <ConditionBadge condition={gear.condition} />
                </TableCell>
                <TableCell className="px-5 py-4">
                  <Availability
                    active={
                      gear.availability !== false && gear.active !== false
                    }
                  />
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      variant="ghost"
                      size="xs"
                      className="rounded-md px-1.5 py-1 text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Link href={`/dashboard/provider/gear/${gear.id}/edit`}>Edit</Link>
                    </Button>
                    <Button
                      onClick={() => handleDelete(gear.id)}
                      disabled={deleteMutation.isPending}
                      className="size-8 rounded-md text-slate-400 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GearTable;
