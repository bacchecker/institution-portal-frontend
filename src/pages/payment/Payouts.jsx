import React, {useState, useEffect} from "react";
import Navbar from "@/components/Navbar";
import CustomTable from "@/components/CustomTable";
import moment from "moment";
import axios from "@/utils/axiosConfig";
import StatusChip from "@/components/status-chip";
import secureLocalStorage from "react-secure-storage";
import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";

const Payouts = ({onTotalChange}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [isLoading, setIsLoading] = useState(false);
    const [allPayments, setAllPayments] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [filters, setFilters] = useState({
        search_query: "",
        document_type: null,
        start_date: null,
        end_date: null,
      });
    
    const [submittedFilters, setSubmittedFilters] = useState({});

    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "/institution/payouts/balances",
          {
            params: {
              ...submittedFilters,
              page: currentPage,
              sort_by: sortBy,
              sort_order: sortOrder,
            },
          }
        );

        const paymentData = response.data.paginated_payouts;
        const total = response.data.total_converted_amount;

        setTotalRevenue(total);
        onTotalChange && onTotalChange(total);

        setAllPayments(paymentData.data);
        setCurrentPage(paymentData.current_page);
        setLastPage(paymentData.last_page);
        setTotal(paymentData.total);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
      }
    };

    useEffect(() => {
        fetchPayments();
    }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1); // Reset to first page on filter submit
  };
  return (
    <div className="">
        <section className="px-0 lg:px-2">
            <Card className="md:w-full w-full mx-auto rounded-none shadow-none border-none">
                <CardBody className="w-full bg-gray-100 p-3 lg:p-6">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-row gap-3 items-center"
                >
                    <input
                    type="text"
                    className={`bg-white text-gray-900 text-sm rounded-[4px] font-[400] focus:outline-none block w-[260px] p-[9.5px] placeholder:text-gray-500`}
                    name="search_query"
                    placeholder="Search by user name or unique code"
                    value={filters.search_query}
                    onChange={(e) =>
                        setFilters({ ...filters, search_query: e.target.value })
                    }
                    />

                    

                    <DateRangePicker
                    visibleMonths={2}
                    variant="underlined"
                    classNames={{
                        base: "bg-white border border-white", // This sets the input background to white
                    }}
                    className="w-[280px] rounded-[4px] date-range-picker-input border border-white bg-white"
                    onChange={(date) => {
                        if (date) {
                        const newStartDate = new Date(
                            date.start.year,
                            date.start.month - 1,
                            date.start.day
                        )
                            .toISOString()
                            .split("T")[0];
                        const newEndDate = new Date(
                            date.end.year,
                            date.end.month - 1,
                            date.end.day
                        )
                            .toISOString()
                            .split("T")[0];

                        setFilters({
                            ...filters,
                            start_date: newStartDate,
                            end_date: newEndDate,
                        });
                        }
                    }}
                    />

                    <div className="flex space-x-2">
                    <Button
                        startContent={<MdOutlineFilterAlt size={17} />}
                        radius="none"
                        size="sm"
                        type="submit"
                        className="rounded-[4px] bg-bChkRed text-white"
                    >
                        Filter
                    </Button>
                    <Button
                        startContent={<MdOutlineFilterAltOff size={17} />}
                        radius="none"
                        size="sm"
                        type="button"
                        className="rounded-[4px] bg-black text-white"
                        onClick={() => {
                        setFilters({
                            search_query: "",
                            document_type: null,
                            start_date: null,
                            end_date: null,
                        });

                        setSubmittedFilters({
                            search_query: "",
                            document_type: null,
                            start_date: null,
                            end_date: null,
                        });
                        }}
                    >
                        Clear
                    </Button>
                    </div>
                </form>
                </CardBody>
            </Card>
        </section> 
      
      <section className="px-2 md:w-full w-[98vw] mx-auto mt-2">
        <CustomTable
          columns={[
            "Date",
            "Currency",
            "Amount",            
            "Exchange Rate",
            "Status",
          ]}
          loadingState={isLoading}
          columnSortKeys={{
            ID: "unique_code",
            "Delivery Address": "delivery_address",
            Date: "created_at",
            Currency: "currency",
            Rate: "exchange_rate",
            Status: "status",
            Amount: "institution_amount",
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          handlePageChange={setCurrentPage}
        >
          {allPayments?.map((item) => (
            <TableRow
              key={item?.id}
              className="odd:bg-gray-100 even:bg-gray-50 border-b"
            >              
              <TableCell>
                {moment(item?.payout_date).format("MMM D, YYYY")}
              </TableCell>
              <TableCell>{item?.currency}</TableCell>
              <TableCell>{item?.amount}</TableCell>
              <TableCell>{item?.exchange_rate}</TableCell>
              <TableCell>
                <StatusChip status={item?.status} />
              </TableCell>
              

              {/* <TableCell className="flex items-center h-16 gap-3">
                <Button
                  radius="none"
                  size="sm"
                  color="success"
                  className="rounded-[4px] text-white"
                  onClick={() => {
                    setData(item);
                    setOpenDrawer(true);
                  }}
                >
                  View
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </CustomTable>
      </section>
    </div>
  );
};

export default Payouts;
