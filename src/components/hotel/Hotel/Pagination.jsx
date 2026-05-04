"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import GlobalLoader from "@/utils/GlobalLoader";

export default function Pagination({ pagination, page }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const goToPage = (p) => {
    startTransition(() => {
      router.push(`/hotel?page=${p}#hotel-list-start`);
    });
  };

  const currentPage = Number(page);

  return (
    <>
      {isPending && <div>
            

<div className="fixed inset-0 z-50 flex items-start justify-center mt-20">
      <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>


        </div>}

      <div className="text-xl flex justify-center gap-2 m-8">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        {/* Pages */}
        {Array.from({ length: pagination.last_page }, (_, i) => {
          const pageNumber = i + 1;

          return (
            <button
              key={i}
              onClick={() => goToPage(pageNumber)}
              className={`px-3 py-1 border rounded ${
                currentPage === pageNumber
                  ? "bg-blue-900 text-white"
                  : ""
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </>
  );
}