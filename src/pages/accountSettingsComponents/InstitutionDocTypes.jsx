import React, { useState, useEffect } from "react";
import {
  TableCell,
  TableRow,
  Popover, PopoverTrigger, PopoverContent,
  Button,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";
import axios from "@/utils/axiosConfig";
import {FaPlus } from "react-icons/fa";
import { MdChecklist, MdEdit, MdMoreVert, MdOutlineFilterAlt, MdOutlineFilterAltOff } from "react-icons/md";
import AddNewDocumentType from "../accountSettingsComponents/documentTypeComponents/AddNewDocumentType";
import EditDocumentType from "../accountSettingsComponents/documentTypeComponents/EditDocumentType";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { BsTrash3 } from "react-icons/bs";
import ChecklistItems from "./documentTypeComponents/ChecklistItems";

export default function InstitutionDocTypes() {
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [documentType, setDocumentType] = useState([]);
    const [existingDocumentTypes, setExistingDocumentTypes] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openChecklistModal, setOpenChecklistModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const closePopover = () => setIsPopoverOpen(false);
    const [filters, setFilters] = useState({
        search: "",
        start_date: null,
        end_date: null,
    });

    const [submittedFilters, setSubmittedFilters] = useState({});

    const fetchDocumentType = async () => {
        setIsLoading(true)
        try {
        const response = await axios.get("/institution/document-types", {
            params: {
            ...submittedFilters,
            page: currentPage,
            sort_by: sortBy,
            sort_order: sortOrder,
            },
        });

        const documentType = response.data.document_types;

        setDocumentType(documentType.data);
        setCurrentPage(documentType.current_page);
        setLastPage(documentType.last_page);
        setTotal(documentType.total);
        setIsLoading(false);

        } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
        }
    };

    useEffect(() => {
      const fetchAvailableDocuments = async () => {
        setIsLoading(true)
        try {
        const response = await axios.get("/institution/document-types/available");

        setExistingDocumentTypes( response.data.available_types);
        } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
        }
      }; 
      fetchAvailableDocuments();
    }, []);

    useEffect(() => {
        fetchDocumentType();
    }, [submittedFilters, currentPage, sortBy, sortOrder]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedFilters({ ...filters });
        setCurrentPage(1);
    };


    const handleUser = (document) => {
        setOpenEditModal(true);
        setSelectedUser(document);
    };

    const handleChecklist = (document) => {
        setOpenChecklistModal(true);
        setSelectedUser(document);        
    };

    const handleClickDelete = async (document, i) => {
        try {
        // Display confirmation dialog
        const result = await Swal.fire({
          title: "Are you sure you want to delete this document type?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#febf4c",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, I'm sure",
          cancelButtonText: "No, cancel",
        });

        if (result.isConfirmed) {
          const response = await axios.delete(`/institution/document-types/${document?.id}`);

          toast.success(response.data.message);
          fetchDocumentType();
        }
        } catch (error) {
        // Error feedback
        toast.error(error.response?.data?.message || "Failed to delete user.", "error");
        }
    };

    return (
        <div>
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
                        placeholder="Search by document name"
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
                    
                        
                    <Button
                        startContent={<FaPlus size={13} />}
                        radius="none"
                        size="sm"
                        type="submit"
                        className="rounded-[4px] bg-black text-white py-0.5"
                        onClick={() => {
                        setOpenModal(true)
                        }}
                    >
                        Add Document Type
                    </Button>
                    </div>
                </div>
            </section>

            <section className="md:w-full w-[98vw] mx-auto">
                <CustomTable
                    columns={[
                        "Document Type",
                        "Formats",
                        "Request Fee",
                        "Validation Fee",
                        "Printing Fee",
                        "Actions",
                    ]}
                    loadingState={isLoading}
                    columnSortKeys={{
                        "Document Type": "document_type_name",
                        "Formats": "format",
                        "Request fee": "document_request_fee",
                        "Validation Fee": "validation_fee",
                        "Printing Fee": "printing_fee",
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
                    {documentType?.map((document) => (
                        <TableRow key={document?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                            <TableCell>
                            {document?.document_type?.name}
                            </TableCell>
                            <TableCell>
                                {document?.soft_copy &&
                                  document?.hard_copy ? (
                                    <div className="text-left">
                                      <p className="text-[#FFA52D]">
                                          Soft copy
                                      </p>
                                      <p className="text-[#000000]">
                                          Hard copy
                                      </p>
                                    </div>
                                  ) : document?.soft_copy ? (
                                      <p className="text-[#FFA52D]">
                                      Soft copy
                                      </p>
                                  ) : document?.hard_copy ? (
                                      <p className="text-[#000000]">
                                      Hard copy
                                      </p>
                                  ) : null
                                }
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-right pr-10">
                                <p className="text-[#FFA52D]">
                                GH₵ {document?.base_fee}
                                </p>
                                <p className="text-[#000000]">
                                  $ {document?.foreign_base_fee}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-right pr-10">
                                <p className="text-[#FFA52D]">
                                GH₵ {document?.validation_fee}
                                </p>
                                <p className="text-[#000000]">
                                  $ {document?.foreign_validation_fee}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-right pr-10">
                                <p className="text-[#FFA52D]">
                                GH₵ {document?.printing_fee}
                                </p>
                                <p className="text-[#000000]">
                                  $ {document?.foreign_printing_fee}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="relative inline-block">
                                <Popover
                                  placement="bottom"
                                  showArrow
                                  radius="none"
                                  open={isPopoverOpen}
                                  onOpenChange={setIsPopoverOpen} // Handles opening/closing state
                                >
                                  <PopoverTrigger>
                                    <button
                                      className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
                                      onClick={() => setIsPopoverOpen((prev) => !prev)} // Toggle popover
                                    >
                                      <MdMoreVert size={20}/>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent radius="none">
                                    <div className="flex flex-col py-1 space-y-1">
                                      
                                      <button
                                        onClick={() => {
                                          handleUser(document);
                                          closePopover(); // Close popover on Edit
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <MdEdit size={17}/>
                                        <p>Edit Document Type</p>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleChecklist(document);
                                          closePopover(); // Close popover on Edit
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <MdChecklist size={17}/>
                                        <p>Checklist Items</p>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleClickDelete(document, document?.id);
                                          closePopover(); // Optionally close popover on Delete
                                        }}
                                        className="text-left text-sm hover:bg-bChkRed hover:text-white px-4 py-1.5 rounded-md w-full flex space-x-2 items-center text-gray-700"
                                      >
                                        <BsTrash3 size={17}/>
                                        <p>Delete Document Type</p>
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
            <AddNewDocumentType
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchDocumentType={fetchDocumentType}
                existingDocumentTypes={existingDocumentTypes}
            />
            <EditDocumentType
                setOpenModal={setOpenEditModal}
                openModal={openEditModal}
                selectedDocumentType={selectedUser}
                existingDocumentTypes={existingDocumentTypes}
                fetchDocumentType={fetchDocumentType}
            />

            <ChecklistItems
                setOpenModal={setOpenChecklistModal}
                openModal={openChecklistModal}
                selectedDocumentType={selectedUser}
                fetchDocumentType={fetchDocumentType}
            />
        </div>
    );
}
