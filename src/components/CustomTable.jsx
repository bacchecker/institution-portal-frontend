import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
} from "@nextui-org/react";
// import noDataIllustration from "@/Assets/illustrations/no-data.svg";

const CustomTable = ({
  columns,
  loadingState,
  children,
  page,
  setPage,
  totalPages,
  customHeightClass,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Table
        aria-label="data table"
        classNames={{
          base: `${
            customHeightClass && customHeightClass
          } md:!max-h-[78vh] font-nunito text-xs overflow-y-auto w-[98vw] md:!w-full overflow-x-auto shadow-none`,
          wrapper:
            "dark:bg-slate-900 vertical-scrollbar horizontal-scrollbar shadow-none bg-white rounded-2xl dark:border border-white/5",
          th: "dark:bg-slate-800",
          td: "text-sm",
        }}
      >
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn
              key={index}
              className={`font-montserrat text-text-sm dark:text-white`}
            >
              {column}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody
          loadingState={loadingState ? "loading" : "idle"}
          loadingContent={<Spinner color="danger" />}
          emptyContent={
            <div className="md:!h-[65vh] h-[60vh] flex flex-col gap-8 items-center justify-center">
              {/* <img src={noDataIllustration} alt="No data" className="w-1/3" /> */}
              <p className="text-center text-slate-500 dark:text-slate-400 font-montserrat font-semibold text-lg">
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
