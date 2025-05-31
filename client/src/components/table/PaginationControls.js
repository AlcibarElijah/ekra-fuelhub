import { useContext } from "react";
import { TableContext } from "./Table";

const PaginationControls = ({ maxPages, currentPage, className }) => {
  const { dispatch } = useContext(TableContext);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= maxPages) {
      dispatch({ type: "SET_PAGE", payload: page });
    }
  };

  let pageNumbers = [];

  if (maxPages <= 3) {
    // If total pages are 3 or less, show all
    pageNumbers = Array.from({ length: maxPages }, (_, i) => i + 1);
  } else if (currentPage === 1) {
    pageNumbers = [1, 2, 3];
  } else if (currentPage === maxPages) {
    pageNumbers = [maxPages - 2, maxPages - 1, maxPages];
  } else {
    pageNumbers = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <nav aria-label="Page navigation example" className={className}>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            aria-label="Previous"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageClick(page)}>
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === maxPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            aria-label="Next"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === maxPages}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationControls;
