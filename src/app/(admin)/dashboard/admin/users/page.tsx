"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus, Users } from "lucide-react";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchAndSort } from "@/app/hooks/useSearchAndSort";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  getAdminUsersAction,
  updateAdminUserStatusAction,
} from "@/app/(admin)/_actions/adminActions";

const ROLES = ["All", "CUSTOMER", "PROVIDER"] as const;
type RoleFilter = (typeof ROLES)[number];

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

const AdminUsersContent = () => {
  const { localSearch, handleSearchChange, searchTerm } = useSearchAndSort();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsersAction,
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "SUSPENDED";
    }) => updateAdminUserStatusAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const filtered = users.filter((u: any) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const counts = {
    All: users.length,
    CUSTOMER: users.filter((u: any) => u.role === "CUSTOMER").length,
    PROVIDER: users.filter((u: any) => u.role === "PROVIDER").length,
  };

  return (
    <div className="p-5 sm:p-8">
      <PageHeading
        title="User Management"
        action={
          <Button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white">
            <UserPlus className="size-4" />
            Add Admin
          </Button>
        }
      />
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <label className="relative xl:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm"
            />
          </label>
          <div className="flex gap-4 overflow-x-auto border-b border-border xl:border-0">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`whitespace-nowrap border-b-2 pb-2 text-sm font-bold ${roleFilter === role ? "border-primary text-primary" : "border-transparent text-slate-500"}`}
              >
                {role} ({counts[role]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm">
          <Users className="mb-4 size-12 text-slate-300" />
          <p className="font-bold text-slate-500">No users found</p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table className="min-w-[700px] w-full text-left text-sm">
            <TableHeader className="border-b border-border bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <TableRow className="hover:bg-transparent">
                {["#", "User", "Role", "Status", "Joined", "Action"].map(
                  (h, i) => (
                    <TableHead key={i} className="px-5 py-3.5">
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user: any, i: number) => {
                const initials = user.name
                  ? user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
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
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-[11px] font-bold text-white">
                          {initials}
                        </span>
                        <div>
                          <p className="text-[13px] font-bold text-foreground">
                            {user.name ?? "—"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {user.email}
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
                    <TableCell className="px-5 py-4">
                      <Button
                        onClick={() =>
                          updateStatus({
                            id: user.id,
                            status:
                              user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                          })
                        }
                        variant="ghost"
                        size="sm"
                        className={user.status === "ACTIVE" ? "bg-primary/10 text-red-600 hover:bg-primary/20 hover:text-red-600" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"}
                      >
                        {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

const AdminUsersPage = () => (
  <Suspense fallback={<DashboardPageFallback />}>
    <AdminUsersContent />
  </Suspense>
);

const DashboardPageFallback = () => (
  <div className="flex h-[60vh] items-center justify-center p-8">
    <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
  </div>
);

export default AdminUsersPage;
