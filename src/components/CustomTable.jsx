import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
} from "@nextui-org/react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
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
  page,
  setPage,
  totalPages,
  customHeightClass,
}) => {
  const getSortIcon = (column) => {
    const sortKey = columnSortKeys[column];
    if (sortBy !== sortKey) return <FaSort />; // Default sort icon
    if (sortOrder === "asc") return <FaSortUp />; // Ascending sort icon
    if (sortOrder === "desc") return <FaSortDown />; // Descending sort icon
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
            "dark:bg-slate-800 vertical-scrollbar horizontal-scrollbar shadow-none rounded-lg dark:border border-white/5 bg-gray-50",
          th: "!rounded-none dark:bg-slate-800", // Remove border-radius
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
                className={`text-text-sm text-gray-700 dark:text-white bg-white text-sm py-4 ${
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
          className="dark:text-slate-700"
          isLoading={loadingState}
          loadingContent={<Spinner color="danger" label="Loading...." />}
          emptyContent={
            <div className="md:!h-[65vh] h-[60vh] flex flex-col gap-8 items-center justify-center">
              <img src="/assets/img/no-data.svg" alt="No data" className="w-1/4 md:w-1/6 h-auto" />
              <p className="text-center text-slate-500 dark:text-slate-400 font-montserrat font-medium text-base -mt-6">
                No data available
              </p>
            </div>
          }
        >
          {children}
        </TableBody>
      </Table>


      <div className="flex w-full items-center justify-between">
        {totalPages > 1 && (
          <Pagination
            page={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
            color="danger"
            showControls
            showShadow
            size="sm"
            classNames={{
              item: "font-montserrat font-semibold bg-white dark:bg-slate-800 dark:text-white",
              next: "font-montserrat font-semibold bg-white dark:bg-slate-800 dark:text-white",
              prev: "font-montserrat font-semibold bg-white dark:bg-slate-800 dark:text-white",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomTable;


