import React, {useState, useEffect} from "react";
import AuthLayout from "../../components/AuthLayout";
import { BsQuestionCircle } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import { Select, SelectItem, Spinner, TableCell, TableRow, Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger, Button } from "@nextui-org/react";
import CustomTable from "@components/CustomTable";
import axios from "@utils/axiosConfig";
import AddTicket from "./AddTicket";
import moment from 'moment';
import EditTicket from "./EditTicket";
import Elipsis from "../../assets/icons/elipsis";


export default function Tickets() {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    // Fetch tickets
    const fetchTickets = async () => {
      setLoading(true);
      try {
          const response = await axios.get('/tickets', {
            params: {
              search,
              status,
              page: currentPage,
              ...(sortBy && { sort_by: sortBy }),
              ...(sortOrder && { sort_order: sortOrder }),
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
    }, [search, status, currentPage, sortBy, sortOrder]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Render page numbers
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= lastPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-2 rounded-lg ${
                        i === currentPage ? 'bg-bChkRed text-white' : 'bg-white text-gray-800 border'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };
  return (
    <AuthLayout title="Tickets">
    <div className="px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-2 lg:col-span-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <p className="text-xl font-semibold">Support Ticket</p>
            <div className="flex items-center space-x-2 border border-gray-400 rounded-full px-2 py-1">
              <BsQuestionCircle size={20}/>
              <p className="text-base">Help</p>
            </div>
          </div>
          <p className="w-2/3 font-light text-base mt-2 text-gray-800">Create a formal report of a service when you need
          help or encounter a problem.</p>
        </div>
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={() => {
              setOpenDrawer(true);
            }} 
            className="flex items-center justify-center w-4/5 text-base space-x-2 bg-bChkRed rounded-lg text-white h-12">
            <FaPlus size={18}/>
            <p>Create Ticket</p>
          </button>
        </div>
          <AddTicket
            fetchTickets={fetchTickets}
            setOpenDrawer={setOpenDrawer}
            openDrawer={openDrawer}
          />
          <EditTicket
            fetchTickets={fetchTickets}
            setOpenEditDrawer={setOpenEditDrawer}
            openEditDrawer={openEditDrawer}
            selectedData={selectedData}
          />
      </div>
      <div className="bg-white px-4 py-3 mt-5 rounded-xl">
        <div className="text-gray-700 flex items-center space-x-4">
          <p className="text-lg font-semibold">Ticket History</p>
          <div className="relative w-full lg:w-1/2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input type="search" onChange={(e) => setSearch(e.target.value)} value={search} id="default-search" className="block w-full focus:outline-0 px-4 py-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by ticket description, subject or status" required />
          </div>
          <Select
            selectedKeys={status}
            onSelectionChange={(selected) => setStatus(selected)}
            label="Filter by Status"
            size="sm"
            className="max-w-[180px] min-w-[180px]"
          >
              <SelectItem key="">All Statuses</SelectItem>
              <SelectItem key="open">Open</SelectItem>
              <SelectItem key="closed">Closed</SelectItem>
              
          </Select>
        </div>
      </div>
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
            >
              {tickets?.map((item) => (
                <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-white border-b dark:text-slate-700">
                  <TableCell className="flex flex-col">
                    <p className="font-semibold">{item?.title}</p>
                    <p className="text-xs text-gray-500">{moment(item?.created_at).format('MMM DD, YYYY')}</p>
                  </TableCell>

                  <TableCell>{item?.description}</TableCell>
                  
                  <TableCell>{item?.type.charAt(0).toUpperCase() + item?.type.slice(1)}</TableCell>
                  <TableCell>{item?.category.charAt(0).toUpperCase() + item?.category.slice(1)}</TableCell>
                  
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-4 py-2 font-light rounded-full border ${
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
            <section>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div>
                    <span className="text-gray-600 font-medium text-sm">
                        Page {currentPage} of {lastPage}
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
      
    </div>
      
    </AuthLayout>
  );
}
