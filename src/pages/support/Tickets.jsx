import React, {useState, useEffect} from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import { TableCell, TableRow, Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger, Button, 
  Card,
  CardBody} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import axios from "@/utils/axiosConfig";
import AddTicket from "./AddTicket";
import moment from 'moment';
import UpdateTicket from "./UpdateTicket";
import Elipsis from "../../assets/icons/elipsis";
import Navbar from "@/components/Navbar";
import secureLocalStorage from "react-secure-storage";
import { MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import PermissionWrapper from "@/components/permissions/PermissionWrapper";
import TicketChat from "./TicketChat";

export default function Tickets() {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);
    const [openChatDrawer, setOpenChatDrawer] = useState(false);
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [filters, setFilters] = useState({
        search_query: "",
        status: null,
    });
    const [submittedFilters, setSubmittedFilters] = useState({});

    const statusData = [
      { id: "open", name: "Open" },
      { id: "closed", name: "Closed" },
      { id: "in progress", name: "In Progress" }
    ];
    // Fetch tickets
    const fetchTickets = async () => {
      setLoading(true);
      try {
          const response = await axios.get('/tickets', {
            params: {
              ...submittedFilters,
              page: currentPage,
              sort_by: sortBy,
              sort_order: sortOrder,
            },
          });
          const ticketsData = response.data.tickets

          setTickets(ticketsData.data);
          setCurrentPage(ticketsData.current_page);
          setLastPage(ticketsData.last_page);
          setTotal(ticketsData.total);
          setLoading(false);
      } catch (error) {
          console.error('Error fetching tickets:', error);
          setLoading(false);
      }
    };

    useEffect(() => {
        fetchTickets();
    }, [submittedFilters, currentPage, sortBy, sortOrder]);
    
    const handleStatusChange = (event) => {
      setFilters({ ...filters, status: event.target.value });
    };
    const handleSubmit = (event) => {
      event.preventDefault();
      setSubmittedFilters({ ...filters });
      setCurrentPage(1); // Reset to first page on filter submit
    };
  return (
    <div className="bg-white">
    <Navbar />
    <div className="p-2 lg:p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-2 lg:col-span-3 lg:mb-2">
          <div className="flex items-center space-x-2 text-gray-700">
            <p className="text-xl font-semibold">Support Ticket</p>
            <div className="flex items-center space-x-2 border border-gray-400 rounded-full px-2 py-1">
              <BsQuestionCircle size={16}/>
              <p className="text-sm">Help</p>
            </div>
          </div>
          <p className="w-full lg:w-2/3 font-light text-sm mt-2 text-gray-800">Create a formal report of a service when you need
          help or encounter a problem.</p>
        </div>
        <PermissionWrapper permission={['institution.tickets.create']}>
          <div className="flex lg:justify-end mb-2 lg:mb-0">
            <button 
              type="button"
              onClick={() => {
                setOpenDrawer(true);
              }} 
              className="flex items-center justify-center text-sm space-x-2 bg-bChkRed rounded-lg text-white h-9 px-4">
              <FaPlus size={18}/>
              <p>Create Ticket</p>
            </button>
          </div>
        </PermissionWrapper>
        
          <AddTicket
            fetchTickets={fetchTickets}
            setOpenModal={setOpenDrawer}
            openModal={openDrawer}
          />
          <UpdateTicket
            selectedTicket={selectedData}
            setOpenModal={setOpenEditDrawer}
            openModal={openEditDrawer}
            fetchTickets={fetchTickets}
          />

          <TicketChat
            selectedTicket={selectedData}
            setOpenModal={setOpenChatDrawer}
            openModal={openChatDrawer}
            fetchTickets={fetchTickets}
          />
      </div>

      <Card className="md:w-full w-full mx-auto shadow-none rounded-md">
          <CardBody className="w-full bg-gray-100 md:p-6 p-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-row gap-3 items-center"
            >
              <input
                type="text"
                className={`bg-white text-gray-900 text-sm rounded-[4px] font-[400] focus:outline-none block w-[360px] p-[9.5px] placeholder:text-gray-500`}
                name="search_query"
                placeholder="Search by ticket description, subject or type"
                value={filters.search_query}
                onChange={(e) =>
                  setFilters({ ...filters, search_query: e.target.value })
                }
              />

              <select
                name="status"
                value={filters.status || ""}
                className={`bg-white text-sm rounded-[4px] focus:outline-none block w-[220px] p-[9px] ${
                  filters.status ? "text-gray-900" : "text-gray-500"
                }`}
                onChange={handleStatusChange}
              >
                <option value="" className="text-gray-500" disabled selected>
                  Status
                </option>
                {statusData.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>

              

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
      
      <section className="md:w-full w-[98vw] min-h-[60vh] mx-auto mt-2">
       
            <CustomTable
              loadingState={loading}
              columns={["Subject", "Description", "Type", "Category", "Status", "Actions"]}
              columnSortKeys={{
                Subject: "title",
                Description: "description",
                Type: "type",
                Category: "category",
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
              {tickets?.map((item) => (
                <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-white border-b">
                  <TableCell className="flex flex-col">
                    <p className="font-semibold">{item?.title}</p>
                    <p className="text-xs text-gray-500">{moment(item?.created_at).format('MMM DD, YYYY')}</p>
                  </TableCell>

                  <TableCell>{item?.description}</TableCell>
                  
                  <TableCell>{item?.type.charAt(0).toUpperCase() + item?.type.slice(1)}</TableCell>
                  <TableCell>{item?.category.charAt(0).toUpperCase() + item?.category.slice(1)}</TableCell>
                  
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-3 text-xs py-1 font-light rounded-full border ${
                        item?.status === 'open'
                          ? 'bg-gray-200 text-gray-700 border-gray-400'
                          : item?.status === 'in progress'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
                          : 'bg-green-100 text-green-700 border-green-400'
                      }`}
                    >
                      {item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}
                    </span>
                  </TableCell>

                  <TableCell className="relative flex items-center">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" size="sm" isIconOnly>
                          <Elipsis />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                          key="view_response"
                          onClick={() => {
                            setPopoverOpen(false);
                            setSelectedData(item);
                            setOpenChatDrawer(true);
                          }}
                        >
                          View Response
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          onClick={() => {
                            setPopoverOpen(false);
                            setSelectedData(item);
                            setOpenEditDrawer(true);
                          }}
                        >
                          Edit Ticket
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    

                  </TableCell>
                </TableRow>
              ))}
              
            </CustomTable>
      </section>
      
    </div>
    </div>
  );
}
