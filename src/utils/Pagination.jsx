"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const goToPage = (p) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", p);

      router.push(`${pathname}?${params.toString()}#list-start`);
    });
  };

  const currentPage = Number(searchParams.get("page") || 1);

  return (
    <>
      {/* Loader */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-start justify-center mt-20 bg-black/10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-6">
        
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 md:px-4 py-2 text-sm md:text-base border rounded disabled:opacity-40 border-blue-900 text-blue-900"
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex flex-wrap justify-center gap-2 max-w-full">
          {Array.from({ length: pagination.last_page }, (_, i) => {
            const pageNumber = i + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`min-w-[40px] px-3 py-2 text-sm md:text-base border rounded transition ${
                  currentPage === pageNumber
                    ? "bg-blue-900 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= pagination.last_page}
          className="px-3 md:px-4 py-2 text-sm md:text-base border border-blue-950 text-blue-900 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </>
  );
}