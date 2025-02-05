import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
} from "@nextui-org/react";
import { FaChevronLeft, FaChevronRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
// import noDataIllustration from "@/Assets/illustrations/no-data.svg";

const CustomTable = ({
  columns,
  columnSortKeys,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  loadingState,
  children,
  currentPage,
  lastPage,
  total,
  handlePageChange,
  customHeightClass,
}) => {
  const getSortIcon = (column) => {
    const sortKey = columnSortKeys[column];
    if (sortBy !== sortKey) return <FaSort />; // Default sort icon
    if (sortOrder === "asc") return <FaSortUp />; // Ascending sort icon
    if (sortOrder === "desc") return <FaSortDown />; // Descending sort icon
  };
  const renderPageNumbers = () => {
    const pageLimit = 5; // Maximum number of visible pages
    const startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
    const endPage = Math.min(startPage + pageLimit - 1, lastPage);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return (
      <>
        {currentPage > 1 && startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="py-1.5 px-2.5 border rounded-lg bg-white text-gray-800"
            >
              1
            </button>
            {startPage > 2 && <span className="py-1.5 px-2.5">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`py-1.5 px-2.5 border rounded-lg ${
              currentPage === page ? "bg-bChkRed text-white" : "bg-white text-gray-800"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < lastPage && (
          <>
            {endPage < lastPage - 1 && <span className="py-1.5 px-2.5">...</span>}
            <button
              onClick={() => handlePageChange(lastPage)}
              className="py-1.5 px-2.5 border rounded-lg bg-white text-gray-800"
            >
              {lastPage}
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <Table
        radius="none"
        aria-label="data table"
        classNames={{
          base: `${
            customHeightClass && customHeightClass
          } md:!max-h-[78vh] font-nunito text-xs overflow-y-auto w-[100vw] rounded-none md:!w-full overflow-x-auto shadow-none`,
          wrapper:
            "vertical-scrollbar horizontal-scrollbar shadow-none rounded-lg border-white/5 bg-gray-50",
          th: "!rounded-none", // Remove border-radius
          td: "text-sm",
        }}
      >
        <TableHeader
          className="!rounded-none" // Ensure no border-radius on the header
        >
          {columns.map((column, index) => {
            const isFilterable = column !== "Actions" && column !== "Permissions";
            return (
              <TableColumn
                key={index}
                onClick={() => {
                  if (!isFilterable) return;
                  const sortKey = columnSortKeys[column]; // Map column to sort_by
                  if (!sortKey) return; // Skip if column is not sortable

                  const newSortOrder =
                    sortBy === sortKey && sortOrder === "asc" ? "desc" : "asc";

                  setSortBy(sortKey);
                  setSortOrder(newSortOrder);
                }}
                className={`text-text-sm text-gray-700 bg-white text-sm py-4 ${
                  isFilterable ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{column}</span>
                  <span className={`${isFilterable ? "flex" : "hidden"}`}>
                    {getSortIcon(column)}
                  </span>
                  
                </div>
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody
          className=""
          isLoading={loadingState}
          loadingContent={<Spinner color="danger" label="Loading...." />}
          emptyContent={
            <div className="md:!h-[35vh] h-[30vh] flex flex-col gap-8 items-center justify-center">
              <img src="/assets/img/no-data.svg" alt="No data" className="w-1/4 md:w-[10%] h-auto" />
              <p className="text-center text-slate-500 font-montserrat font-medium text-base -mt-6">
                No data available
              </p>
            </div>
          }
        >
          {children}
        </TableBody>
      </Table>

        {/* Pagination */}
        <section className="flex justify-between items-center my-1">
          <div>
            <span className="text-gray-600 font-medium text-sm">
              Page {currentPage} of {lastPage} - ({total} entries)
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
            >
              <FaChevronLeft size={12} />
            </button>
            {renderPageNumbers()}
            <button
              disabled={currentPage === lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </section>

    </div>
  );
};

export default CustomTable;


