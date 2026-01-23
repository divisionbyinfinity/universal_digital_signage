import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function Pagination({ totalPages = 0, currentPage = 0, handleCurrPage = null }) {
  const [pageNos, setPageNos] = useState([]);

  useEffect(() => {
    const PageNos = Array.from({ length: totalPages }, (_, index) => index + 1);
    setPageNos(PageNos);
  }, [totalPages]);

  const classNames = (...classes) => classes.filter(Boolean).join(" ");
  if (totalPages === 0) return null;

  return (
    <div className="relative bottom-0  w-full  flex justify-end z-40 bg-gray-200 pr-10">
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm  px-3 py-2"
        aria-label="Pagination"
      >
        {/* Prev button */}
        <a
          className={classNames("page-button page-button-side", currentPage === 1 ? "disabled" : "")}
          onClick={() => currentPage > 1 && handleCurrPage(currentPage - 1)}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </a>

        {/* Page numbers */}
        {pageNos.map((page) => (
          <a
            key={page}
            onClick={() => handleCurrPage(page)}
            className={classNames("page-button", currentPage === page ? "active" : "")}
          >
            {page}
          </a>
        ))}

        {/* Next button */}
        <a
          style={{ marginLeft: "2px" }}
          className={classNames(
            "page-button page-button-side",
            currentPage === totalPages ? "disabled" : ""
          )}
          onClick={() => currentPage < totalPages && handleCurrPage(currentPage + 1)}
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </nav>
    </div>
  );
}
