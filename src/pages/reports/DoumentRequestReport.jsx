import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import CustomTable from "../../components/CustomTable";
import moment from "moment";
import StatusChip from "../../components/status-chip";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function DocumentRequestReport() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
      status: searchParams.get("status") || "",
      date_range: searchParams.get("date_range") || "",
    });

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [resData, setResData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requestPayments, setRequestPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
      setFilters({
        status: searchParams.get("status") || "",
        date_range: searchParams.get("date_range") || "",
      });
    }, [searchParams]);

    /* useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const queryParams = new URLSearchParams();
          if (filters.status) queryParams.append("status", filters.status);
          if (filters.date_range) queryParams.append("date_range", filters.date_range);

          const response = await axios.get(`/institution/reports/institution-requests?${queryParams.toString()}`);
          const docRequest = response.data.requestPayments
          setRequestPayments(docRequest.data);
          setCurrentPage(docRequest.current_page);
          setLastPage(docRequest.last_page);
          setTotal(docRequest.total);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      //fetchData();
    }, [filters, currentPage, sortBy, sortOrder]); */

    const fetchRequestPayments = async () => {
      setIsLoading(true); // Set loading state
      try {
        const response = await axios.get("/institution/reports/institution-requests", {
          params: {
            search,
            page: currentPage,
            ...(sortBy && { sort_by: sortBy }),
            ...(sortOrder && { sort_order: sortOrder }),
          },
        });
    
        const docRequest = response.data.requestPayments

        setRequestPayments(docRequest.data);
        setCurrentPage(docRequest.current_page);
        setLastPage(docRequest.last_page);
        setTotal(docRequest.total);

      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };
  
    useEffect(() => {
      fetchRequestPayments();
    }, [search, currentPage, sortBy, sortOrder]);

    // Update URL search parameters whenever filters change
    useEffect(() => {
      setSearchParams({
        status: filters.status,
        date_range: filters.date_range,
      });
    }, [filters, setSearchParams]);

    const handlePageChange = (page) => {
      if (page >= 1 && page <= lastPage) {
        setCurrentPage(page);
      }
    };
  
    const renderPageNumbers = () => {
      const pages = [];
      for (let i = 1; i <= lastPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`py-2 px-2.5 border rounded-lg ${
              currentPage === i ? "bg-bChkRed text-white" : "bg-white text-gray-800"
            }`}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
  return (
    <>
      <section>
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900 flex justify-end">
          <CardBody className="w-full flex justify-end">
            <form
              method="get"
              className="flex flex-row gap-3 justify-end"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({
                  search: createSearchParams(filters).toString(),
                });
              }}
            >
              <Select
                size="sm"
                placeholder="Status"
                className="max-w-[130px] min-w-[130px]"
                name="status"
                defaultSelectedKeys={[filters?.status]}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                {[
                  {
                    key: "submitted",
                    label: "submitted",
                  },
                  {
                    key: "received",
                    label: "received",
                  },
                  {
                    key: "processing",
                    label: "processing",
                  },
                  {
                    key: "completed",
                    label: "completed",
                  },
                  {
                    key: "cancelled",
                    label: "cancelled",
                  },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>

              <Select
                size="sm"
                placeholder="Time Frame"
                className="max-w-[130px] min-w-[130px]"
                name="date_range"
                defaultSelectedKeys={[filters.date_range]}
                onChange={(e) =>
                  setFilters({ ...filters, date_range: e.target.value })
                }
              >
                {[
                  { key: "week", label: "Weekly" },
                  { key: "month", label: "Monthly" },
                  { key: "quarter", label: "Quarterly" },
                  { key: "year", label: "Yearly" },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
            </form>
          </CardBody>
        </Card>
      </section>
      <section className="md:w-full w-[98vw] mx-auto">
        <CustomTable
          columns={[
            "Unique Code",
            "Document Type",
            "Document Format",
            "Date",
            "Status",
            "Revenue",
          ]}
          loadingState={isLoading}
          columnSortKeys={{
            "Unique Code": "unique_code",
            "Document Type": "document_type.name",
            "Document Format": "document_requests.format",
            Date: "created_at",
            Status: "document_requests.status",
            Revenue: "amount",
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        >
          {requestPayments?.map((item) => (
            <TableRow key={item.id} className="odd:bg-gray-100 even:bg-white border-b dark:text-slate-700">
              <TableCell className="font-semibold">
                {item.unique_code}
              </TableCell>
              <TableCell>{item.document_request?.document_type?.name}</TableCell>
              <TableCell>{item.document_request?.document_format}</TableCell>
              <TableCell>
                {moment(item.created_at).format("MM-DD-YYYY")}
              </TableCell>
              <TableCell>
                <StatusChip status={item.document_request?.status} />
              </TableCell>
              <TableCell>GH¢ {item.amount}</TableCell>
            </TableRow>
          ))}
        </CustomTable>
        <section>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-gray-600 font-medium text-sm">
                Page {currentPage} of {lastPage} - ({total} entries)
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
              >
                <FaChevronLeft size={12} />
              </button>

              {renderPageNumbers()}

              <button
                disabled={currentPage === lastPage}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default DocumentRequestReport;
