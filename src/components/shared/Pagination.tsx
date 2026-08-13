"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage?: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (setPage) {
      setPage(newPage);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
      <button
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-9 items-center gap-1 rounded-lg px-3 text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
        Prev
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`flex size-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
            p === page
              ? "bg-primary text-white"
              : "border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-9 items-center gap-1 rounded-lg px-3 text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
