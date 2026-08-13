"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ClipboardList,
  Boxes,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  getAdminUsersAction,
  getAdminGearAction,
  getAdminRentalsAction,
} from "@/app/(admin)/_actions/adminActions";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const RoleBadge = ({ role }: { role: string }) => {
  const classes: Record<string, string> = {
    CUSTOMER: "bg-blue-50 text-blue-600",
    PROVIDER: "bg-amber-50 text-amber-600",
    ADMIN: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${classes[role] ?? "bg-slate-100 text-slate-600"}`}
    >
      {role}
    </span>
  );
};

const AdminDashboardPage = () => {
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsersAction,
  });

  const { data: gearItems = [], isLoading: isLoadingGear } = useQuery({
    queryKey: ["admin-gear"],
    queryFn: getAdminGearAction,
  });

  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: getAdminRentalsAction,
  });

  const isLoading = isLoadingUsers || isLoadingGear || isLoadingRentals;

  // Chart Data Calculations
  const chartData = useMemo(() => {
    if (isLoading) return null;

    // --- BAR CHART: Last 18 days rentals ---
    const last18Days = Array.from({ length: 18 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (17 - i));
      return d.toISOString().split("T")[0];
    });

    const rentalsByDay = rentals.reduce((acc: Record<string, number>, r: any) => {
      const day = r.createdAt.split("T")[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const maxRentals = Math.max(1, ...Object.values(rentalsByDay) as number[]);

    const barHeights = last18Days.map((day) => {
      const count = rentalsByDay[day] || 0;
      // Map to a height string from 20px to 160px for Tailwind inline styles
      const px = Math.max(20, Math.round((count / maxRentals) * 160));
      return `${px}px`;
    });

    // --- PIE CHART: Revenue by Category ---
    const validRentals = rentals.filter((r: any) =>
      ["PAID", "PICKED_UP", "RETURNED"].includes(r.status),
    );

    const totalRevenue = validRentals.reduce(
      (acc: number, r: any) => acc + parseFloat(r.totalAmount),
      0,
    );

    const catRevenue = validRentals.reduce((acc: Record<string, number>, r: any) => {
      const cat = r.gearItem?.category?.name || "Other";
      acc[cat] = (acc[cat] || 0) + parseFloat(r.totalAmount);
      return acc;
    }, {});

    const sortedCats = Object.entries(catRevenue).sort((a, b) => (b[1] as number) - (a[1] as number));
    const top4 = sortedCats.slice(0, 4);
    const othersVal = sortedCats
      .slice(4)
      .reduce((acc, [, val]) => acc + (val as number), 0);

    const pieItems = [...top4];
    if (othersVal > 0) pieItems.push(["Others", othersVal]);

    const colors = ["#e31824", "#1b2748", "#f4b740", "#60a5fa", "#cbd5e1"];
    
    let cumulative = 0;
    const conicStops = pieItems.map(([_, val], i) => {
      const pct = ((val as number) / Math.max(1, totalRevenue)) * 100;
      const start = cumulative;
      cumulative += pct;
      return `${colors[i % colors.length]} ${start}% ${cumulative}%`;
    });

    const conicGradient = `conic-gradient(${conicStops.join(", ")})`;

    return {
      barHeights,
      last18Days,
      pieItems: pieItems.map(([name, val], i) => ({
        name: name as string,
        val: val as number,
        pct: Math.round(((val as number) / Math.max(1, totalRevenue)) * 100),
        color: colors[i % colors.length],
      })),
      conicGradient,
      totalRevenue,
    };
  }, [rentals, isLoading]);

  if (isLoading || !chartData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
      </div>
    );
  }

  const activeGear = gearItems.filter((g: any) => g.isAvailable).length;

  const stats: [React.ElementType, string, string, string, string, string][] = [
    [
      Users,
      users.length.toString(),
      "Total Users",
      "Live",
      "bg-blue-50 text-blue-600",
      "bg-blue-600",
    ],
    [
      Boxes,
      activeGear.toString(),
      "Active Listings",
      "Available",
      "bg-primary/10 text-primary",
      "bg-primary",
    ],
    [
      ClipboardList,
      rentals.length.toString(),
      "Total Rentals",
      "All Time",
      "bg-amber-50 text-amber-600",
      "bg-amber-500",
    ],
    [
      DollarSign,
      `$${chartData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Platform Revenue",
      "All Time",
      "bg-emerald-50 text-emerald-600",
      "bg-emerald-500",
    ],
  ];

  const recentUsers = users.slice(0, 5);
  const recentRentals = rentals.slice(0, 5);

  return (
    <div className="p-6 sm:p-10 bg-slate-50/50 min-h-screen">
      {/* Hero Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Welcome back, Admin 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening on RentRover today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([Icon, num, label, trend, bg, accent]) => (
          <Card
            key={label}
            className="relative overflow-hidden p-6"
          >
            <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">
                  {num}
                </p>
                <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="size-3.5" />
                  {trend}
                </p>
              </div>
              <span
                className={`flex size-11 items-center justify-center rounded-full ${bg}`}
              >
                <Icon className="size-5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <Card className="p-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
              <BarChart3 className="size-5 text-primary" />
              Rentals Over Time{" "}
              <span className="text-sm font-medium text-slate-400">
                Last 18 days
              </span>
            </h2>
          </div>
          <div className="mt-9 flex h-48 items-end gap-[3px] border-b border-border pb-1">
            {chartData.barHeights.map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                <div
                  title={chartData.last18Days[i]}
                  style={{ height }}
                  className={`w-full rounded-t-sm transition-all duration-500 ${i === 17 ? "bg-primary" : "bg-slate-900 hover:bg-blue-800"}`}
                />
              </div>
            ))}
          </div>
          {/* P3-7: X-axis date labels — show every 3rd day to avoid crowding */}
          <div className="mt-1 flex gap-[3px] overflow-hidden">
            {chartData.last18Days.map((day, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[8px] text-slate-400"
                title={day}
              >
                {i % 3 === 0
                  ? new Date(day).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
                  : ""}
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-8">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <PieChart className="size-5 text-primary" />
            Revenue Breakdown
          </h2>
          <div className="mt-8 flex items-center justify-around gap-8 sm:justify-start sm:gap-12">
            <div
              className="flex size-44 shrink-0 items-center justify-center rounded-full"
              style={{ background: chartData.conicGradient }}
            >
              <div className="flex size-28 flex-col items-center justify-center rounded-full bg-white text-center">
                <span className="text-xl font-extrabold text-foreground">
                  {/* P3-8: Smart formatter — exact $ for <1000, 'k' shorthand for >=1000 */}
                  {chartData.totalRevenue >= 1000
                    ? `$${(chartData.totalRevenue / 1000).toFixed(1)}k`
                    : `$${chartData.totalRevenue.toFixed(0)}`}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-0.5">
                  Total Revenue
                </span>
              </div>
            </div>
            <ul className="space-y-3 text-sm font-medium text-slate-600">
              {chartData.pieItems.map((item) => (
                <li key={item.name} className="flex items-center">
                  <i
                    className="mr-3 inline-block size-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name} {item.pct}%
                </li>
              ))}
              {chartData.pieItems.length === 0 && (
                <li className="text-slate-400">No revenue data</li>
              )}
            </ul>
          </div>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <section className="flex flex-col h-full min-w-0">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Recent Users
            </h2>
            <Link
              href="/dashboard/admin/users"
              className="text-[13px] font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full rounded-lg border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <Table className="min-w-[500px] w-full text-left text-sm">
                <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <TableRow className="hover:bg-transparent">
                    {["#", "User", "Role", "Status", "Joined", ""].map((x, i) => (
                      <TableHead key={i} className="px-5 py-3.5">
                        {x}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user: any, i: number) => {
                    const initials = user.name
                      ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                      : "??";
                    return (
                      <TableRow
                        key={user.id}
                        className="border-b border-border last:border-0 hover:bg-slate-50/50"
                      >
                        <TableCell className="px-5 py-4 text-[13px] text-slate-400">
                          {i + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
                              {initials}
                            </span>
                            <div>
                              <p className="text-[13px] font-bold text-foreground">
                                {user.name ?? "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-red-600"}`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-right">
                          <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                            <MoreVertical className="size-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
        <section className="flex flex-col h-full min-w-0">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Recent Rentals
            </h2>
            <Link
              href="/dashboard/admin/rentals"
              className="text-[13px] font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full rounded-lg border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <Table className="min-w-[500px] w-full text-left text-sm">
                <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <TableRow className="hover:bg-transparent">
                    {["ID", "Customer", "Item", "Amount", "Status", "Date", ""].map((h, i) => (
                      <TableHead key={i} className="px-5 py-3.5">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRentals.map((order: any) => (
                    <TableRow
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-slate-50/50"
                    >
                      <TableCell className="px-5 py-4 text-[13px] font-bold text-primary">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] font-medium text-foreground">
                        {order.customer?.name ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] text-slate-600">
                        {order.gearItem?.name ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] font-bold text-foreground">
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] text-slate-500">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <MoreVertical className="size-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
