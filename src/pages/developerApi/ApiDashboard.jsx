import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CustomTable from "@/components/CustomTable";
import axios from "@/utils/axiosConfig";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
  TableCell,
  TableRow,
  RadioGroup,
  Radio,
  ModalBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import moment from "moment";
import {
  MdEdit,
  MdMoreVert,
  MdOutlineFilterAlt,
  MdOutlineFilterAltOff,
} from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { FaKey, FaEye } from "react-icons/fa";
import EditApi from "./EditApi";
import { FaPlusCircle } from "react-icons/fa";

const ApiDashboard = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialUserInput = {
    name: "",
    environment: "test",
    scopes: [],
  };
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);
  const [apiScopes, setApiScopes] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    search_query: "",
  });
  const [submittedFilters, setSubmittedFilters] = useState({});
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [scrollBehavior] = React.useState("inside");

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchScopes = async () => {
    try {
      const response = await axios.get("/v1/institution/api-keys/scopes");
      setApiScopes(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/v1/institution/api-keys", {
        params: {
          ...submittedFilters,
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      setApiKeys(response.data.data);
      setCurrentPage(response.data.data.current_page);
      setLastPage(response.data.data.last_page);
      setTotal(response.data.data.total);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
    fetchScopes();
  }, [submittedFilters, currentPage, sortBy, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedFilters({ ...filters });
    setCurrentPage(1); // Reset to first page on filter submit
  };

  const handleCreateApi = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: userInput.name,
        environment: userInput.environment,
        scopes: selectedScopes,
      };

      const response = await axios.post("/v1/institution/api-keys", payload);
      onOpenChange(false);
      fetchApiKeys();
      setUserInput(initialUserInput);
      setSelectedScopes([]);
      toast.success(response.data.message);
      setIsSaving(false);
    } catch (error) {
      console.error("Error creating API key:", error);
      setIsSaving(false);
    }
  };

  const handleApi = (item) => {
    const transformedItem = {
      ...item,
      scopes: (item.scopes || []).map((s) =>
        typeof s === "string" ? { id: s, name: s } : s
      ),
    };

    setOpenEditModal(true);
    setSelectedApi(transformedItem);
  };

  const handleClickDelete = async (item) => {
    try {
      // Display confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure you want to delete this API Key?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#febf4c",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `/v1/institution/api-keys/${item?.id}`
        );

        toast.success(response.data.message);
        fetchApiKeys();
      }
    } catch (error) {
      // Error feedback
      toast.error(
        error.response?.data?.message || "Failed to delete api.",
        "error"
      );
    }
  };

  const handleShowSecret = async (item) => {
    try {
      const result = await Swal.fire({
        title: "Generate New Secret?",
        text: "This will generate a new API secret and invalidate the old one. Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#febf4c",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, generate new secret",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `/v1/institution/api-keys/${item?.id}/show-secret`
        );

        // Show the new secret in a modal
        await Swal.fire({
          title: "New API Secret Generated",
          html: `<div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0;">
            <strong>New Secret:</strong><br>
            <code style="word-break: break-all;">${response.data.data.api_secret}</code>
          </div>
          <p><strong>Warning:</strong> This secret will not be shown again. Save it securely!</p>`,
          icon: "success",
          confirmButtonText: "I've saved it securely",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate new secret.",
        "error"
      );
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="bg-white min-h-screen p-6 text-gray-700 font-sans">
        {/* Top Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#1ec43c] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <img
                  src="/assets/img/docx.svg"
                  alt=""
                  className="md:w-[1.5vw] w-[5vw]"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">
                  Performance
                </h4>
                <h4 className={`md:text-[0.8vw] text-[3.5vw] text-gray-500`}>
                  Source on Stats
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">38%</span>
              <span className="text-gray-400 text-sm">-07%</span>
            </div>
          </div>
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#50199d] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <img
                  src="/assets/img/docx.svg"
                  alt=""
                  className="md:w-[1.5vw] w-[5vw]"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">Request</h4>
                <h4 className={`md:text-[0.8vw] text-[3.5vw] text-gray-500`}>
                  Source on Stats
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">38%</span>
              <span className="text-gray-400 text-sm">-07%</span>
            </div>
          </div>
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#ff0404] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <img
                  src="/assets/img/docx.svg"
                  alt=""
                  className="md:w-[1.5vw] w-[5vw]"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">Error</h4>
                <h4 className={`md:text-[0.8vw] text-[3.5vw] text-gray-500`}>
                  Source on Stats
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">38%</span>
              <span className="text-gray-400 text-sm">-07%</span>
            </div>
          </div>
          <div className="w-full bg-[#f8f8f8] md:p-[0.2vw] p-[1vw] md:rounded-[0.4vw] rounded-[1.1vw] border border-[#0000000f]">
            <div className="w-full bg-[#ffffff] border border-[#0000000f] md:rounded-[0.3vw] rounded-[1vw] flex md:p-[0.5vw] p-[2vw] items-center md:gap-[0.5vw] gap-[1vw]">
              <div className="md:w-[3vw] md:h-[3vw] w-[10vw] h-[10vw] bg-[#818712] md:rounded-[0.2vw] rounded-[0.8vw] flex items-center justify-center">
                <img
                  src="/assets/img/docx.svg"
                  alt=""
                  className="md:w-[1.5vw] w-[5vw]"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="md:text-[1vw] text-[3vw] font-[600]">Latency</h4>
                <h4 className={`md:text-[0.8vw] text-[3.5vw] text-gray-500`}>
                  Source on Stats
                </h4>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-gray-800">38%</span>
              <span className="text-gray-400 text-sm">-07%</span>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="4xl"
          scrollBehavior={scrollBehavior}
          radius="sm"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create New API
                </ModalHeader>
                <ModalBody>
                  <form className="md:px-[1vw] px-[5vw] w-full">
                    <div className=" mb-4">
                      <h4 className="md:text-[1.1vw] text-[4vw] mb-1 font-semibold">
                        API Name
                        <span className="text-[#f1416c]">*</span>
                      </h4>
                      <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                        <input
                          type="text"
                          name="name"
                          value={userInput.name}
                          onChange={handleUserInput}
                          required
                          className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <h4 className="md:text-[1.1vw] text-[4vw] mb-1 font-semibold">
                        Environment<span className="text-[#f1416c]">*</span>
                      </h4>
                      <RadioGroup orientation="horizontal">
                        <Radio
                          size="sm"
                          value="test"
                          isSelected={userInput.environment === "test"}
                          onChange={() =>
                            setUserInput((prev) => ({
                              ...prev,
                              environment: "test",
                            }))
                          }
                        >
                          Test
                        </Radio>
                        <Radio
                          size="sm"
                          value="live"
                          isSelected={userInput.environment === "live"}
                          onChange={() =>
                            setUserInput((prev) => ({
                              ...prev,
                              environment: "live",
                            }))
                          }
                        >
                          Live
                        </Radio>
                      </RadioGroup>
                    </div>
                    <div className="mt-4">
                      <h4 className="md:text-[1.1vw] text-[4vw] mb-1 font-semibold">
                        API Scopes<span className="text-[#f1416c]">*</span>
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(apiScopes || {}).map(
                          ([resource, scopes]) => (
                            <div key={resource} className="mb-[0.3vw]">
                              <div className="flex items-center gap-[0.5vw]">
                                <h2 className="text-[14px] capitalize font-[600]">
                                  {`Manage ${resource.replace("-", " ")}`}
                                </h2>
                                <input
                                  type="checkbox"
                                  className="checkbox-design1"
                                  onChange={(e) => {
                                    const scopeNames = scopes.map(
                                      (s) => s.name
                                    );
                                    if (e.target.checked) {
                                      setSelectedScopes((prev) => [
                                        ...new Set([...prev, ...scopeNames]),
                                      ]);
                                    } else {
                                      setSelectedScopes((prev) =>
                                        prev.filter(
                                          (name) => !scopeNames.includes(name)
                                        )
                                      );
                                    }
                                  }}
                                  checked={scopes.every((s) =>
                                    selectedScopes.includes(s.name)
                                  )}
                                />
                              </div>
                              <div className="ml-[0.1vw] mt-[0.3vw]">
                                {scopes.map((scope) => (
                                  <div key={scope.name} className="ml-[0.5vw]">
                                    <label className="flex items-center gap-[0.3vw] text-[0.9vw] cursor-pointer mb-1">
                                      <input
                                        type="checkbox"
                                        className="checkbox-design1"
                                        checked={selectedScopes.includes(
                                          scope.name
                                        )}
                                        onChange={() => {
                                          setSelectedScopes((prev) =>
                                            prev.includes(scope.name)
                                              ? prev.filter(
                                                  (n) => n !== scope.name
                                                )
                                              : [...prev, scope.name]
                                          );
                                        }}
                                      />
                                      <span>
                                        <p>{scope.name}</p>
                                        {/* {scope.description
                                          ? ` — ${scope.description}`
                                          : ""} */}
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </form>
                </ModalBody>

                <ModalFooter>
                  <Button className="rounded-sm" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    className="bg-bChkRed text-white rounded-sm"
                    isLoading={isSaving}
                    onPress={handleCreateApi}
                  >
                    Create API
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <section className="mb-4">
          <div className="relative md:w-full flex bg-gray-100 justify-between items-center w-full mx-auto rounded-none shadow-none border-none p-4">
            <div className="w-full flex items-center justify-between">
              <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-3 items-center"
              >
                <input
                  type="text"
                  className={`bg-white text-gray-900 text-[13px] rounded-[4px] font-[400] focus:outline-none block w-[360px] p-2 placeholder:text-gray-500`}
                  name="search"
                  placeholder="Search by API name"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
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
                        search: "",
                        document_type: null,
                        start_date: null,
                        end_date: null,
                      });

                      setSubmittedFilters({
                        search: "",
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
              <Button
                startContent={<FaPlusCircle size={17} />}
                size="sm"
                className="bg-bChkRed text-white rounded"
                radius="none"
                onPress={onOpen}
              >
                Create New API{" "}
              </Button>
            </div>
          </div>
        </section>
        <section className="md:w-full w-[100vw] mx-auto">
          <CustomTable
            columns={[
              "Created By",
              "API Name",
              "Date",
              "API Key",
              "Environment",
              "Actions",
            ]}
            loadingState={isLoading}
            columnSortKeys={{
              "API Name": "name",
              Date: "created_at",
              "API Key": "api_key",
              Environment: "environment",
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
            {apiKeys?.data?.map((item) => (
              <TableRow
                key={item?.id}
                className="odd:bg-gray-100 even:bg-gray-50 border-b"
              >
                <TableCell className="font-semibold">
                  {item?.created_by?.first_name} {item?.created_by?.last_name}
                </TableCell>
                <TableCell className="font-semibold">{item?.name}</TableCell>
                <TableCell>
                  {moment(item?.created_at).format("MMM D, YYYY")}
                </TableCell>
                <TableCell>{item?.api_key}</TableCell>
                <TableCell>
                  <div
                    className={`px-3 rounded-full py-1 w-12 ${
                      item?.environment == "live"
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {item?.environment}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="relative inline-block">
                    <Popover
                      placement="bottom"
                      showArrow
                      radius="none"
                      bordered
                      open={isPopoverOpen}
                      onOpenChange={setIsPopoverOpen}
                      triggerType="listbox" // Handles opening/closing state
                    >
                      <PopoverTrigger>
                        <button
                          className="w-full flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
                          onClick={() => setIsPopoverOpen((prev) => !prev)} // Toggle popover
                        >
                          <MdMoreVert size={20} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent radius="none">
                        <div className="flex flex-col py-1 space-y-1">
                          <button
                            onClick={() => {
                              handleApi(item);
                            }}
                            className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                          >
                            <MdEdit size={17} />
                            <p>Edit API</p>
                          </button>
                          <button
                            onClick={() => {
                              handleShowSecret(item);
                            }}
                            className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                          >
                            <FaKey size={17} />
                            <p>Show Secret</p>
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = `/developers-api/${item.id}`;
                            }}
                            className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                          >
                            <FaEye size={17} />
                            <p>View Details</p>
                          </button>
                          <button
                            onClick={() => {
                              handleClickDelete(item);
                            }}
                            className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                          >
                            <BsTrash3 size={17} />
                            <p>Delete API</p>
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </section>
        {openEditModal && (
          <EditApi
            setOpenModal={setOpenEditModal}
            openModal={openEditModal}
            selectedApi={selectedApi}
            apiScopes={apiScopes}
            fetchApiKeys={fetchApiKeys}
          />
        )}
      </div>
    </div>
  );
};

export default ApiDashboard;
