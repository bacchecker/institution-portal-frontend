import React, { useState } from "react";
import { useGetUserSystemLogsQuery } from "../redux/apiSlice";
import moment from "moment";
import LoadItems from "../components/LoadItems";
import { toast } from "sonner";
import secureLocalStorage from "react-secure-storage";
import Navbar from "@/components/Navbar";

function SystemLogs() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [isExportReload, setIsExportReload] = useState(false);
  const [selectedTo, setSelectedTo] = useState("");
  const [submitButton, setSubmitButton] = useState("");
  let currentDate = new Date().toISOString().split("T")[0];
  const initialUserInput = {
    from: currentDate,
    to: currentDate,
  };
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));
  let permissions = secureLocalStorage.getItem('userPermissions') || [];


  const [userInput, setUserInput] = useState(initialUserInput);
  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const {
    data: systemLogs,
    isLoading,
    isFetching,
  } = useGetUserSystemLogsQuery({
    page: pageNumber,
    selectedFrom: selectedFrom != "" ? selectedFrom : currentDate,
    selectedTo: selectedTo != "" ? selectedTo : currentDate,
    ...(searchValue !== undefined &&
      searchValue !== "" &&
      searchValue !== null && { searchValue }),
  });

  const handleSearchSystemLog = (e) => {
    e.preventDefault();
    const submitterName = e.nativeEvent.submitter?.name;
    setSubmitButton(submitterName);
    const { to, from } = userInput;
    const currentDate = new Date().toISOString().split("T")[0];
    if (from !== "") {
      setSelectedFrom(from);
    }
    if (to !== "") {
      setSelectedTo(to ? to : currentDate);
    }
  };
  const handleClearFields = () => {
    setSelectedFrom(currentDate);
    setSelectedTo(currentDate);
    setUserInput((userInput) => ({
      ...userInput,
      from: currentDate,
      to: currentDate,
    }));
  };

  const handleExportLogs = () => {
    setIsExportReload(true);

    toast.success("Your data will be exported soon", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    const apiUrl = `https://admin-dev.baccheck.online/api/system-logs/institution/export`;
    const params = new URLSearchParams({
      page: 1,
      selectedFrom: selectedFrom != "" ? selectedFrom : currentDate,
      selectedTo: selectedTo != "" ? selectedTo : currentDate,
      user_id: user?.user?.id,
    });

    if (searchValue !== undefined && searchValue !== "")
      params.append("search_query", searchValue);

    const finalUrl = `${apiUrl}?${params.toString()}`;

    setTimeout(() => {
      window.location.replace(finalUrl);
      setIsExportReload(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white md:p-[1vw] p-[5vw]">
        <div className="flex justify-between mt-[2vw] flex-direct-sm">
          <div className="flex items-center gap-[2vw]">
            <h4 className="md:text-[1.2vw] text-[3.5vw] font-[600]">
              System Logs
            </h4>
            <div className="relative md:w-[15vw] w-[66vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden border-[1.5px] border-[#a9a9a9]">
              <i className="z-[1] bx bx-search absolute top-[50%] translate-y-[-50%] md:left-[0.5vw] left-[3vw] md:text-[1vw] text-[5vw]"></i>
              <input
                type="text"
                id="search"
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-full md:pl-[2vw] md:pr-[0.5vw] pl-[10vw] pr-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                placeholder="Search by IP Address"
              />
            </div>
          </div>
          <form
            onSubmit={handleSearchSystemLog}
            className="flex flex-direct-sm md:items-center md:gap-[1vw] gap-[5vw] mt-[4vw] md:mt-0"
          >
            <div className="flex items-center md:gap-[0.5vw] gap-[2vw]">
              <h4 className="md:text-[1vw] text-[3.5vw]">From</h4>
              <div className="relative md:w-[9vw] w-[80vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden border-[1.5px] border-[#a9a9a9]">
                <input
                  type="date"
                  id="from"
                  name="from"
                  value={userInput.from}
                  onChange={(e) => handleUserInput(e)}
                  required={userInput.to != ""}
                  className="w-full h-full md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                />
              </div>
            </div>
            <div className="flex items-center md:gap-[0.5vw] gap-[2vw]">
              <h4 className="md:text-[1vw] text-[3.5vw]">To</h4>
              <div className="relative md:w-[9vw] w-[85vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1vw!important] overflow-hidden border-[1.5px] border-[#a9a9a9]">
                <input
                  type="date"
                  id="to"
                  name="to"
                  value={userInput.to}
                  onChange={(e) => handleUserInput(e)}
                  min={userInput.from}
                  className="w-full h-full md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isFetching && submitButton === "searchTransactionBtn"}
              name="searchTransactionBtn"
              className="new-btn bg-[#FF0404] px-[1vw]  md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#f48181]"
            >
              {isFetching && submitButton === "searchTransactionBtn" ? (
                <LoadItems color={"#ffffff"} size={14} />
              ) : (
                <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                  filter
                </h4>
              )}
            </button>
            <button
              type="button"
              onClick={handleClearFields}
              disabled={
                userInput?.to === currentDate && userInput?.from === currentDate
              }
              className="new-btn bg-[#000000] px-[1vw]  md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#202020] transition-all duration-300 disabled:bg-[#414141] disabled:cursor-not-allowed"
            >
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Clear
              </h4>
            </button>

            {permissions.includes("institution.activity-logs.export") && (
              <button
                type="button"
                onClick={handleExportLogs}
                className="new-btn border border-[#000000]  px-[1vw] md:text-[1vw] text-[3.5vw] text-[#000000]  md:mt-0 mt-[3vw] flex justify-center items-center md:py-[0.7vw] py-[2vw] md:h-[2.3vw] h-[12vw] md:rounded-[0.3vw] rounded-[1vw] gap-[0.5vw] hover:bg-[#202020] hover:text-[#ffffff] transition-all duration-300"
              >
                {isExportReload ? (
                  <>
                    <LoadItems color={"#000000"} size={15} />
                    <h4>Exporting...</h4>
                  </>
                ) : (
                  <>
                    <i class="bx bx-export"></i>
                    Export
                  </>
                )}
              </button>
            )}
          </form>
        </div>
        <div className="content">
          <div className="w-full md:min-h-[40vw] min-h-[100vw] gap-[3vw] overflow-auto bg-[#f8f8f8] p-[1vw] table-cover md:mt-[1vw] mt-[6vw] scroll-width">
            <table className="md:w-full w-[250vw] border-collapse md:text-[0.9vw] text-[3.5vw] relative">
              <thead className="bg-white sticky top-0 z-[20]">
                <tr className="text-left">
                  <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b">
                    <div className="flex gap-[1vw]">
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
                      <h4 className="md:text-[1vw] text-[3.5vw]">
                        Date & Time
                      </h4>
                    </div>
                  </th>
                  <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b">
                    <div className="flex gap-[1vw]">
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
                      <h4 className="md:text-[1vw] text-[3.5vw]">IP Address</h4>
                    </div>
                  </th>
                  <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b">
                    <div className="flex gap-[1vw]">
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
                      <h4 className="md:text-[1vw] text-[3.5vw]">Browser</h4>
                    </div>
                  </th>
                  <th className="md:py-[1vw] py-[3vw] md:px-[1vw] px-[3vw] border-b">
                    <div className="flex gap-[1vw]">
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
                      <h4 className="md:text-[1vw] text-[3.5vw]">Action</h4>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {!isFetching && !isLoading ? (
                  <>
                    {systemLogs?.activityLogs?.data?.length === 0 ? (
                      <tr>
                        <td colSpan={7} rowSpan={5}>
                          <div className="w-full h-[35vw] flex flex-col justify-center items-center">
                            <img
                              src="/assets/img/no-data.svg"
                              alt=""
                              className="w-[10vw]"
                            />
                            <h4 className="md:text-[1vw] text-[3.5vw] font-[600]">
                              No Log Available
                            </h4>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {systemLogs?.activityLogs?.data?.map((systemlog, i) => {
                          return (
                            <tr key={i}>
                              <td className="py-[1vw] px-[1vw] border-b w-[15%]">
                                {moment(systemlog?.created_at).format(
                                  "YYYY-MM-DD h:mm a"
                                )}
                              </td>
                              <td className="py-[1vw] px-[2.5vw] border-b">
                                {systemlog?.ip_address}
                              </td>

                              <td className="py-[1vw] px-[2.5vw] border-b">
                                {systemlog?.user_agent}
                              </td>

                              <td className="px-[1vw] border-b">
                                {systemlog?.action}
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
              <span>{systemLogs?.activityLogs?.last_page}</span>
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
                    Math.min(prev + 1, systemLogs?.activityLogs?.last_page)
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
        </div>
      </div>
    </>
  );
}

export default SystemLogs;
