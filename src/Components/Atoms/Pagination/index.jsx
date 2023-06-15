import React, { useState } from "react";
import ReactPaginate from "react-paginate";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(0);

  // Handler for page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="flex justify-end mr-10">
      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={10}
        onPageChange={handlePageChange}
        containerClassName="flex items-center gap-2 mt-5 mb-4"
        previousLinkClassName="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        nextLinkClassName="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        disabledClassName="opacity-50 cursor-not-allowed"
        activeClassName="text-blue-500"
      />
    </div>
  );
}

export default Pagination;
