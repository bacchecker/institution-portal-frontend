import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import CustomTable from "@components/CustomTable";
import { FaAnglesLeft, FaAnglesRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import useSWR, { mutate } from "swr";
import DeleteModal from "@components/DeleteModal";
import axios from "@utils/axiosConfig";
import Elipsis from "@assets/icons/elipsis";
import NewDocumentTypeCreation from "./institutionDocumentTypesComponents/NewDocumentTypeCreation";
import EditDocumentType from "./institutionDocumentTypesComponents/EditDocumentType";
import Swal from "sweetalert2";
import ExistingDocumentTypeCreation from "./institutionDocumentTypesComponents/ExistingDocumentTypeCreation";
import AuthLayout from "../../components/AuthLayout";

function InstitutionDocumentTypes() {
  const [isSaving, setSaving] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDeleting, setDeleting] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openNewDrawer, setOpenNewDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [institutionDocuments, setInstitutionDocuments] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const deleteDisclosure = useDisclosure();

  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const {
    data: existingInstitutionDocumentTypes,
    error,
    isLoading,
  } = useSWR(
    () => {
      if (institution?.type === "bacchecker-academic") {
        return `/institutions/document-types?academic_level=${institution?.academic_level}`;
      } else {
        return `/institutions/document-types?institution_type=non-academic`;
      }
    },
    (url) => axios.get(url).then((res) => res.data)
  );

  const fetchInstitutionDocuments = async () => {
    setDocLoading(true)
    try {
      const response = await axios.get("/institution/document-types", {
        params: {
          search,
          page: currentPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });

      const docTypes = response.data.document_types;

    // Update the states with the received data
    setInstitutionDocuments(docTypes.data); // Array of document types
    setCurrentPage(docTypes.current_page); // Current page number
    setLastPage(docTypes.last_page); // Last page number
    setTotal(docTypes.total); // Total number of document types
    setDocLoading(false); // Set loading state to false

    } catch (error) {
      console.error("Error fetching institution documents:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInstitutionDocuments();
  }, [search, currentPage, sortBy, sortOrder]);

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
          className={`py-1.5 px-2.5 border rounded-lg ${
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
    <AuthLayout title="Document Types">
      <div className="w-full px-5 pb-4">
        <div className="border-b border-[#ff0404] py-4">
          <h4 className="text-[1rem] font-[600] mb-4">
            Each institution utilizes specific document types for their
            operations. To proceed with your account setup, please add the
            document types accepted by your school. Below is a list of common
            document types used by{" "}
            {institution?.academic_level ?? "Business or government"}{" "}
            institutions. You may add from the{" "}
            <span className="text-[#ff0404]">existing options</span> or{" "}
            <span className="text-[#ff0404]">
              add new document types if necessary
            </span>
            .
          </h4>
          <h4 className="text-[1rem] font-[600] mb-2">
            Existing Document Types
          </h4>
          <div className="w-full flex flex-wrap gap-2">
            {isLoading ? (
              <div className="w-full h-[5rem] flex justify-center items-center">
                <Spinner size="sm" color="danger" />
              </div>
            ) : (
              <>
                {existingInstitutionDocumentTypes?.data?.types?.map(
                  (documentType, i) => {
                    return (
                      <div className="w-fit h-fit border border-[#333333] px-2 py-2 rounded-[0.3rem]">
                        {documentType?.name}
                      </div>
                    );
                  }
                )}
              </>
            )}
          </div>
        </div>
        <div className="my-3 w-full flex justify-end mx-auto dark:bg-slate-900 mt-6">
          <div className="flex gap-4 items-center">
            <button
              type="button"
              onClick={() => {
                setOpenDrawer(true);
              }}
              className="w-fit flex items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
            >
              Add From Existing Type
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenNewDrawer(true);
              }}
              className="w-fit flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
            >
              Add New Document Type
            </button>
          </div>
        </div>
        <div>
          <ExistingDocumentTypeCreation
            setOpenDrawer={setOpenDrawer}
            openDrawer={openDrawer}
            existingInstitutionDocumentTypes={existingInstitutionDocumentTypes}
          />
          <NewDocumentTypeCreation
            setOpenDrawer={setOpenNewDrawer}
            openDrawer={openNewDrawer}
          />
          <EditDocumentType
            setOpenDrawer={setOpenEditDrawer}
            openDrawer={openEditDrawer}
            selectedData={selectedData}
          />
        </div>
        <section className="md:w-full w-[98vw] min-h-[60vh] mx-auto">
          
            <>
              <CustomTable
                loadingState={docLoading}
                columns={[
                  "Name",
                  "Document Format",
                  "Document Fee",
                  "Printing Fee",
                  "Validation Fee",
                  "Verification Fee",
                  "Actions",
                ]}
                columnSortKeys={{
                  Name: "document.name",
                  "Document Fee": "base_fee",
                  "Printing Fee": "printing_fee",
                  "Validation Fee": "validation_fee",
                  "Verification Fee": "verification_fee",
                 
                }}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              >
                {institutionDocuments?.map((item) => (
                  <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-white border-b dark:text-slate-700">
                    <TableCell>{item?.document_type?.name}</TableCell>
                    <TableCell>
                      {item?.soft_copy && item?.hard_copy
                        ? "hard copy, soft copy"
                        : !item?.soft_copy && item?.hard_copy
                        ? "hard copy"
                        : "soft copy"}
                    </TableCell>
                    <TableCell>GH¢ {item?.base_fee}</TableCell>
                    <TableCell>GH¢ {item?.printing_fee}</TableCell>
                    <TableCell>GH¢ {item?.validation_fee}</TableCell>
                    <TableCell> GH¢ {item?.verification_fee}</TableCell>
                    <TableCell className="flex items-center h-12 gap-3">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" size="sm" isIconOnly  className="dark:border-slate-400 dark:text-slate-600">
                            <Elipsis />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem
                            key="edit"
                            onClick={() => {
                              setSelectedData(item);
                              setOpenEditDrawer(true);
                            }}
                          >
                            Update
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            onClick={() => {
                              deleteDisclosure.onOpen();
                              setSelectedData(item);
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </CustomTable>
              <section>
                <div className="flex justify-between items-center mt-1">
                  <div>
                    <span className="text-gray-600 font-medium text-sm">
                      Page {currentPage} of {lastPage} - ({total} entries)
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white"
                    >
                      <FaChevronLeft size={12} />
                    </button>

                    {renderPageNumbers()}

                    <button
                      disabled={currentPage === lastPage}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-2 bg-white text-gray-800 border rounded-lg disabled:bg-gray-300 disabled:text-white disabled:border-0"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </section>
            </>
        </section>
        <DeleteModal
          disclosure={deleteDisclosure}
          title="Delete Document Type"
          processing={isDeleting}
          onButtonClick={async () => {
            setDeleting(true);
            try {
              const response = await axios.delete(
                `/institution/document-types/${selectedData?.id}`
              );
              deleteDisclosure.onClose();
              Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "OK",
                confirmButtonColor: "#00b17d",
              }).then((isOkay) => {
                if (isOkay) {
                  mutate("/institution/document-types");
                  setDeleting(false);
                }
              });
            } catch (error) {
              console.log(error);
              setErrors(error.response.data.message);
              setDeleting(false);
            }
          }}
        >
          <p className="font-quicksand">
            Are you sure you want to delete this document type?{" "}
            <span className="font-semibold">
              {selectedData?.document_type?.name}
            </span>
          </p>
        </DeleteModal>
      </div>
    </AuthLayout>
  );
}

export default InstitutionDocumentTypes;
