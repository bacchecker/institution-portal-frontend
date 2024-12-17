import React, { useEffect, useState } from "react";
import SideModal from "../../components/SideModal";
import { useGetAllTicketsQuery } from "../../redux/apiSlice";
import SelectInput from "../../components/SelectInput";
import LoadItems from "../../components/LoadItems";
import moment from "moment";
import UpdateTicket from "./UpdateTicket";

function TicketTable() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const statuses = [
    { title: "All", value: "" },
    { title: "Open", value: "open" },
    { title: "In Progress", value: "in progress" },
    { title: "Closed", value: "closed" },
  ];

  const {
    data: allTickets,
    isLoading,
    isFetching,
  } = useGetAllTicketsQuery({
    page: pageNumber,
    ...(searchValue !== undefined &&
      searchValue !== "" &&
      searchValue !== null && { searchValue }),
    ...(selectedStatus?.value !== undefined &&
      selectedStatus?.value !== "" &&
      selectedStatus?.value !== null && {
        selectedStatus: selectedStatus?.value,
      }),
    ...(sortBy !== undefined && sortBy !== "" && sortBy !== null && { sortBy }),
    ...(sortOrder !== undefined &&
      sortOrder !== "" &&
      sortOrder !== null && { sortOrder }),
  });

  const handleOpenModal = (ticket) => {
    setOpenModal(true);
    setSelectedTicket(ticket);
  };

  const handleSelectedStatus = (item) => {
    setSelectedStatus(item);
  };

  const handleSortOrder = () => {
    if (!sortBy && !sortOrder) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("");
      setSortBy("");
    }
  };

  return (
    <>
      <div className="flex justify-between mt-[3vw] flex-direct-sm">
        <div className="flex items-center gap-[2vw]">
          <h4 className="md:text-[1.2vw] text-[3.5vw] font-[600]">
            Ticket History
          </h4>
          <div className="relative md:w-[15vw] w-[52vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden border-[1.5px] border-[#a9a9a9]">
            <i className="z-[1] bx bx-search absolute top-[50%] translate-y-[-50%] md:left-[1vw] left-[3vw] md:text-[1vw] text-[5vw]"></i>
            <input
              type="text"
              id="search"
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-full md:pl-[3vw] md:pr-[1vw] pl-[10vw] pr-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex items-center md:gap-[2vw] gap-[5vw] mt-[4vw] md:mt-0">
          <SelectInput
            placeholder={"Filter by status"}
            data={statuses}
            inputValue={selectedStatus?.title}
            onItemSelect={handleSelectedStatus}
            className="custom-dropdown-class1"
          />
        </div>
      </div>
      <div className="w-full bg-[#f8f8f8] p-[1vw] md:min-h-[40vw] min-h-[100vw] gap-[3vw] overflow-auto  table-cover md:mt-[2vw] mt-[6vw] scroll-width">
        <table className="md:w-full w-[230vw] border-collapse md:text-[0.9vw] text-[3.5vw] rounded-[0.7vw] relative">
          <thead className="bg-white sticky top-0 z-[20]">
            <tr className="text-left">
              <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[15%]">
                <div
                  className="flex gap-[1vw] cursor-pointer"
                  onClick={() => {
                    setSortBy("title");
                    handleSortOrder("title");
                  }}
                >
                  <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                    <i
                      className={`bx bxs-up-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "desc") &&
                        sortBy === "title"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>

                    <i
                      className={`bx bxs-down-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "asc") &&
                        sortBy === "title"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                  </div>
                  <h4 className="md:text-[1vw] text-[3.5vw]">Subject</h4>
                </div>
              </th>
              <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[13%]">
                <div
                  className="flex gap-[1vw] cursor-pointer"
                  onClick={() => {
                    setSortBy("description");
                    handleSortOrder("description");
                  }}
                >
                  <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                    <i
                      className={`bx bxs-up-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "desc") &&
                        sortBy === "description"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                    <i
                      className={`bx bxs-down-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "asc") &&
                        sortBy === "description"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                  </div>
                  <h4 className="md:text-[1vw] text-[3.5vw]">Description</h4>
                </div>
              </th>
              <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[13%]">
                <div
                  className="flex gap-[1vw] cursor-pointer"
                  onClick={() => {
                    setSortBy("type");
                    handleSortOrder("type");
                  }}
                >
                  <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                    <i
                      className={`bx bxs-up-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "desc") &&
                        sortBy === "type"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                    <i
                      className={`bx bxs-down-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "asc") && sortBy === "type"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                  </div>
                  <h4 className="md:text-[1vw] text-[3.5vw]">Type</h4>
                </div>
              </th>
              <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[13%]">
                <div
                  className="flex gap-[1vw] cursor-pointer"
                  onClick={() => {
                    setSortBy("category");
                    handleSortOrder("category");
                  }}
                >
                  <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                    <i
                      className={`bx bxs-up-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "desc") &&
                        sortBy === "category"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                    <i
                      className={`bx bxs-down-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "asc") &&
                        sortBy === "category"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                  </div>
                  <h4 className="md:text-[1vw] text-[3.5vw]">Category</h4>
                </div>
              </th>
              {/* <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[15%]">
                <div className="flex gap-[1vw] cursor-pointer"
                 onClick={() => {
                  setSortBy("type");
                  handleSortOrder("type");
                }}>
                  <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                    <img
                      src="/assets/img/top-arr.svg"
                      alt=""
                      className="md:w-[0.5vw] w-[2vw]"
                    />
                    <img
                      src="/assets/img/down-arr.svg"
                      alt=""
                      className="md:w-[0.5vw] w-[2vw]"
                    />
                  </div>
                  <h4 className="md:text-[1vw] text-[3.5vw]">Created At</h4>
                </div>
              </th> */}
              <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[15%]">
                <div
                  className="flex gap-[1vw] cursor-pointer"
                  onClick={() => {
                    setSortBy("status");
                    handleSortOrder("status");
                  }}
                >
                  <div className="flex flex-col items-center justify-center md:gap-[0.1vw] gap-[0.3vw]">
                    <i
                      className={`bx bxs-up-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "desc") &&
                        sortBy === "status"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                    <i
                      className={`bx bxs-down-arrow text-[0.6vw] ${
                        (!sortOrder || sortOrder === "asc") &&
                        sortBy === "status"
                          ? "text-[#ffffff]"
                          : ""
                      }`}
                    ></i>
                  </div>
                  <h4 className="md:text-[1vw] text-[3.5vw]">Status</h4>
                </div>
              </th>
              <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b w-[10%]">
                <div className="flex gap-[1vw]">
                  <h4 className="md:text-[1vw] text-[3.5vw]">Action</h4>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="">
            {!isFetching && !isLoading ? (
              <>
                {allTickets?.tickets?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={7} rowSpan={5}>
                      <div className="w-full h-[35vw] flex flex-col justify-center items-center">
                        <img
                          src="/assets/img/no-data.svg"
                          alt=""
                          className="w-[10vw]"
                        />
                        <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                          No Ticket Available
                        </h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {allTickets?.tickets?.data?.map((ticket, i) => {
                      return (
                        <tr key={i}>
                          {/* <td className="py-[1vw] px-[1vw] border-b w-[15%]">
                            {ticket?.ticket_number}
                          </td> */}
                          <td className="py-[1vw] px-[2.5vw] border-b w-[15%]">
                            {ticket?.title}
                          </td>
                          <td className="py-[1vw] px-[2.5vw] border-b w-[13%]">
                            {ticket?.description}
                          </td>
                          <td className="py-[1vw] px-[2.5vw] border-b w-[13%]">
                            {ticket?.type}
                          </td>
                          <td className="py-[1vw] px-[2.5vw] border-b w-[13%]">
                            {ticket?.category}
                          </td>
                          {/* <td className="py-[1vw] px-[2.5vw] border-b w-[15%]">
                            {moment(ticket?.created_at).format("ll")}
                          </td> */}

                          <td className="md:py-[1vw] py-[3vw] md:px-[2.5vw] px-[6vw] border-b w-[15%]">
                            <div
                              className={`md:py-[0.3vw] py-[0.5vw] md:px-[1vw] px-[3vw] w-[fit-content] border ${
                                ticket?.status?.toLowerCase() === "open"
                                  ? "border-[#b5b4b4] bg-[#e6e5e5]"
                                  : ticket?.status?.toLowerCase() === "closed"
                                  ? "border-[#C4FFE1] bg-[#C4FFE1]"
                                  : "border-[#f8e5cc] bg-[#fbf5ee]"
                              } flex items-center justify-center md:rounded-[2vw] rounded-[4vw]`}
                            >
                              <h4
                                className={`md:text-[0.9vw] text-[3vw] ${
                                  ticket?.status?.toLowerCase() === "open"
                                    ? "text-[#000]"
                                    : ticket?.status?.toLowerCase() === "closed"
                                    ? "text-[#00612D]"
                                    : "text-[#FFA52D]"
                                } capitalize`}
                              >
                                {ticket?.status}
                              </h4>
                            </div>
                          </td>
                          <td className="px-[1vw] border-b w-[10%]">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(ticket)}
                              className="new-btn text-[#ff0404] underline"
                            >
                              Edit Ticket
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={7} rowSpan={5}>
                  <div className="w-full h-[35vw] flex items-center justify-center">
                    <LoadItems color={"#000000"} />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end items-center md:gap-[1vw] gap-[3vw] md:mt-[1vw] mt-[4vw]">
        <h4 className="md:text-[1vw] text-[3.5vw]">
          Page <span>{pageNumber}</span> of{" "}
          <span>{allTickets?.tickets?.last_page}</span>
        </h4>
        <div className="flex md:gap-[1vw] gap-[3vw]">
          <button
            type="button"
            onClick={() => {
              setPageNumber((prev) => Math.max(prev - 1, 1));
            }}
            className="md:w-[2.5vw] md:h-[2.5vw] w-[10vw] h-[10vw] rounded-[50%] bg-[#d0d0d0] flex justify-center items-center"
          >
            <img
              src="/assets/img/arr-b.svg"
              alt=""
              className="md:w-[1.1vw] w-[4vw]"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              setPageNumber((prev) =>
                Math.min(prev + 1, allTickets?.tickets?.last_page)
              );
            }}
            className="md:w-[2.5vw] md:h-[2.5vw] w-[10vw] h-[10vw] rounded-[50%] bg-[#d0d0d0] flex justify-center items-center"
          >
            <img
              src="/assets/img/arr-f.svg"
              alt=""
              className="md:w-[1.1vw] w-[4vw]"
            />
          </button>
        </div>
      </div>

      <UpdateTicket
        selectedTicket={selectedTicket}
        setOpenModal={setOpenModal}
        openModal={openModal}
      />
    </>
  );
}

export default TicketTable;
