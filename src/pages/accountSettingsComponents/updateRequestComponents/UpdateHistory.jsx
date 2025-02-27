import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  DateRangePicker,
  Input,
  Select,
  Tabs,
  Tab,
  TableCell,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import moment from "moment";
import axios from "@/utils/axiosConfig";
import StatusChip from "@/components/status-chip";
import Drawer from "@/components/Drawer";
import { toast } from "sonner";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";

export default function UpdateHistory() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [requestedChanges, setRequestedChanges] = useState({});
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    search_query: "",
    status: null,
    start_date: null,
    end_date: null,
  });
  const [submittedFilters, setSubmittedFilters] = useState({});
  const statusData = [
    { value: "pending", name: "Pending" },
    { value: "approved", name: "Approved" },
    { value: "rejected", name: "Rejected" },
  ];
  const handleChange = (itemId, isCorrect, comment = "") => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: { 
        is_correct: isCorrect ? 1 : 0, // Convert true → 1, false → 0
        comment: comment 
      },
    }));
  };
  

  const institutionUpdateRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "/institution/update-requests-history",
        {
          params: {
            ...submittedFilters,
            page: currentPage,
            sort_by: sortBy,
            sort_order: sortOrder,
          },
        }
      );
      const valRequest = response.data.data;

      setUpdateRequests(valRequest.data);
      setRequestedChanges(valRequest.data.requested_changes);
      setCurrentPage(valRequest.current_page);
      setLastPage(valRequest.last_page);
      setTotal(valRequest.total);
      setIsLoading(false);
     
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  useEffect(() => {
    institutionUpdateRequests();
  }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1);
  };


  return (
    <>
      <div title="Incoming Request">
        <section className="px-3">
          <Card className="md:w-full w-full mx-auto rounded-md shadow-none border-none mb-2">
            <CardBody className="w-full bg-gray-100 p-6">
              <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-3 items-center"
              >
                <select
                  name="status"
                  value={filters.status || ""}
                  className={`bg-white text-sm rounded-[4px] focus:outline-none block w-[220px] p-[9px] ${
                    filters.status ? "text-gray-900" : "text-gray-500"
                  }`}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="" className="text-gray-500" disabled selected>
                    Status
                  </option>
                  {statusData.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <DateRangePicker
                  radius="none"
                  visibleMonths={2}
                  variant="underlined"
                  classNames={{
                    base: "bg-white", // This sets the input background to white
                  }}
                  style={{
                    border: "none", // Removes the border
                  }}
                  className="w-[280px] rounded-[4px] date-range-picker-input border-none bg-white"
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
                        status: null,
                        start_date: null,
                        end_date: null,
                      });

                      setSubmittedFilters({
                        search_query: "",
                        status: null,
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

        <section className="md:px-3 md:w-full w-[98vw] mx-auto">
          <CustomTable
            columns={[
              "Date",
              "Requested By",
              "Status",
              /* "Changes", */
              "Actions",
            ]}
            loadingState={isLoading}
            columnSortKeys={{
              "Requested By": "user_full_name",
              Date: "created_at",
              Status: "status",
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
            {updateRequests?.map((item) => (
              <TableRow
                key={item?.id}
                className="odd:bg-gray-100 even:bg-white border-b"
              >
                <TableCell className="font-semibold">
                {moment(item?.created_at).format("MMM D, YYYY")}
                </TableCell>
                
                <TableCell>
                  {item?.requested_by?.first_name}{" "}{item?.requested_by?.last_name}
                </TableCell>
                <TableCell>
                  <StatusChip status={item?.status} />
                </TableCell>
                <TableCell className="flex items-center h-16 gap-3">
                  <Button
                    size="sm"
                    radius="none"
                    color="success"
                    className="rounded-[4px] text-white"
                    onClick={ () => {
                      setData(item);
                      setOpenDrawer(true);
                    }}
                  >
                    View
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </section>

        <Drawer
            title={`Update Request Details`}
            isOpen={openDrawer}
            setIsOpen={setOpenDrawer}
            classNames="w-[100vw] md:w-[45vw] lg:w-[36vw] z-10"
        >
        <div className="h-full flex flex-col -mt-2 xl:pl-2 font-semibold justify-between">
            <div className="-mt-4">
                <div className="w-full flex justify-end">
                    <StatusChip status={data?.status}/>
                </div>
            
            {data?.requested_changes &&
                Object.entries(data.requested_changes).map(([key, value]) => (
                <div key={key} className="mt-4">
                    <h4 className="md:text-[1vw] text-[4vw] mb-1">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h4>
                    <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                    <input
                        type="text"
                        value={value}
                        name={key}
                        readOnly
                        placeholder={`Enter your ${key.replace(/_/g, " ")}`}
                        className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                    />
                    </div>
                </div>
                ))}
            </div>
            {data?.status === "rejected" && (
                <div className="mt-3 border rounded-md p-4">
                    <p className="font-semibold text-red-600">Rejection Reason</p>
                    <p className="font-normal">{data?.rejection_reason}</p>
                    <div className="mt-3 flex flex-row">
                    <div className="flex-1">
                        <p className="font-semibold text-red-600">Rejection Date</p>
                        <p className="font-normal">
                        {moment(data?.updated_at).format("Do MMMM, YYYY")}
                        </p>
                    </div>
                    </div>
                </div>
            )}
            {data?.status == "approved" && (
                <div className="mt-3 border rounded-md p-4">
                    <div className="mt-3">
                    <div className="flex flex-row">
                        
                        <div className="flex-1">
                            <p className="font-semibold text-green-700">
                            Approved By:
                            </p>
                            <p className="font-normal">
                            {data?.approved_by?.first_name}{" "}
                            {data?.approved_by?.last_name}
                            </p>
                            <p className="text-[11px] font-normal">
                            {data?.approved_by?.email}
                            </p>
                        </div>

                        <div className="flex-1">
                        <p className="font-semibold text-green-700">
                            Approval Date
                        </p>
                        <p className="font-normal">
                            {moment(data?.approved_at).format("Do MMMM, YYYY")}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                )}
        </div>
        </Drawer>

      </div>
    </>
  );
}
