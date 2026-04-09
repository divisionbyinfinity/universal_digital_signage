import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function Pagination({ totalPages = 0, currentPage = 0, handleCurrPage = null }) {
  const [pageNos, setPageNos] = useState([]);

  useEffect(() => {
    const PageNos = Array.from({ length: totalPages }, (_, index) => index + 1);
    setPageNos(PageNos);
  }, [totalPages]);

  const classNames = (...classes) => classes.filter(Boolean).join(" ");
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-shell">
      <nav
        className="pagination-nav"
        aria-label="Pagination"
      >
        {/* Prev button */}
        <button
          type="button"
          className={classNames("page-button page-button-side", currentPage === 1 ? "disabled" : "")}
          onClick={() => currentPage > 1 && handleCurrPage(currentPage - 1)}
          aria-label="Previous page"
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Page numbers */}
        {pageNos.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => handleCurrPage(page)}
            className={classNames("page-button", currentPage === page ? "buttonActive" : "")}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          type="button"
          className={classNames(
            "page-button page-button-side",
            currentPage === totalPages ? "disabled" : ""
          )}
          onClick={() => currentPage < totalPages && handleCurrPage(currentPage + 1)}
          aria-label="Next page"
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
